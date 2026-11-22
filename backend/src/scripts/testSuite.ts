import { parsePreco } from '../services/produtoService';
import { app } from '../app';
import http from 'http';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    results.push({ name: testName, passed: true });
    console.log(`  ✓ ${testName}`);
  } else {
    results.push({ name: testName, passed: false, error: errorMsg || 'Assertion failed' });
    console.error(`  ✗ ${testName} - Falha: ${errorMsg}`);
  }
}

async function runTests() {
  console.log('\n==================================================');
  console.log('       INICIANDO BATERIA DE TESTES DA API        ');
  console.log('==================================================\n');

  // -----------------------------------------------------------------
  // 1. Testes de Unidade: Normalizacao e Validacao de Preco
  // -----------------------------------------------------------------
  console.log('--- Testes de Normalizacao de Preco (parsePreco) ---');

  assert(parsePreco('1250,90') === 1250.9, 'Preco com virgula simples: "1250,90" -> 1250.9');
  assert(parsePreco('1.250,90') === 1250.9, 'Preco brasileiro com ponto e virgula: "1.250,90" -> 1250.9');
  assert(parsePreco('1250.90') === 1250.9, 'Preco americano: "1250.90" -> 1250.9');
  assert(parsePreco('15') === 15.0, 'Preco inteiro como string: "15" -> 15.0');
  assert(parsePreco(49.99) === 49.99, 'Preco numerico direto: 49.99 -> 49.99');
  assert(parsePreco('-10.50') === null, 'Preco negativo em string "-10.50" deve retornar null');
  assert(parsePreco(-5) === null, 'Preco negativo numerico -5 deve retornar null');
  assert(parsePreco(0) === null, 'Preco zero numerico 0 deve retornar null');
  assert(parsePreco('0') === null, 'Preco zero em string "0" deve retornar null');
  assert(parsePreco('') === null, 'Preco vazio "" deve retornar null');
  assert(parsePreco('   ') === null, 'Preco com espacos "   " deve retornar null');
  assert(parsePreco('invalido') === null, 'Preco alfabetico "invalido" deve retornar null');
  assert(parsePreco(null) === null, 'Preco nulo null deve retornar null');
  assert(parsePreco(undefined) === null, 'Preco indefinido undefined deve retornar null');

  // -----------------------------------------------------------------
  // 2. Testes de Validacao HTTP (Endpoints sem depender do DB externo)
  // -----------------------------------------------------------------
  console.log('\n--- Testes de Integracao HTTP / Validacao de Endpoints ---');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3001;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 2.1 Healthcheck
    const resHealth = await fetch(`${baseUrl}/health`);
    const jsonHealth: any = await resHealth.json();
    assert(
      resHealth.status === 200 && jsonHealth.status === 'ok',
      'GET /health deve retornar HTTP 200 e status ok'
    );

    // 2.2 POST /produtos com nome vazio
    const resEmptyName = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: '   ', preco: 100 }),
    });
    const jsonEmptyName: any = await resEmptyName.json();
    assert(
      resEmptyName.status === 400 && jsonEmptyName.success === false,
      'POST /produtos com nome vazio deve retornar HTTP 400 Bad Request'
    );

    // 2.3 POST /produtos com preco invalido
    const resInvalidPrice = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Teclado Mecanico', preco: 'invalido' }),
    });
    const jsonInvalidPrice: any = await resInvalidPrice.json();
    assert(
      resInvalidPrice.status === 400 && jsonInvalidPrice.success === false,
      'POST /produtos com preco alfabetico deve retornar HTTP 400'
    );

    // 2.4 POST /produtos com preco negativo
    const resNegativePrice = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Monitor Gamer', preco: -150 }),
    });
    const jsonNegativePrice: any = await resNegativePrice.json();
    assert(
      resNegativePrice.status === 400 && jsonNegativePrice.success === false,
      'POST /produtos com preco negativo deve retornar HTTP 400'
    );

    // 2.5 POST /produtos com campos ausentes
    const resMissingFields = await fetch(`${baseUrl}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const jsonMissingFields: any = await resMissingFields.json();
    assert(
      resMissingFields.status === 400 && jsonMissingFields.success === false,
      'POST /produtos sem corpo deve retornar HTTP 400'
    );

    // 2.6 DELETE /produtos/:id com ID invalido (nao numerico)
    const resInvalidId = await fetch(`${baseUrl}/produtos/abc`, {
      method: 'DELETE',
    });
    const jsonInvalidId: any = await resInvalidId.json();
    assert(
      resInvalidId.status === 400 && jsonInvalidId.success === false,
      'DELETE /produtos/abc com ID nao numerico deve retornar HTTP 400'
    );

    // 2.7 DELETE /produtos/:id com ID negativo
    const resNegativeId = await fetch(`${baseUrl}/produtos/-1`, {
      method: 'DELETE',
    });
    const jsonNegativeId: any = await resNegativeId.json();
    assert(
      resNegativeId.status === 400 && jsonNegativeId.success === false,
      'DELETE /produtos/-1 com ID negativo deve retornar HTTP 400'
    );
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  // -----------------------------------------------------------------
  // Resumo
  // -----------------------------------------------------------------
  console.log('\n==================================================');
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  console.log(`RESULTADO FINAL: ${passed}/${total} testes passaram com sucesso!`);
  console.log('==================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Erro na execucao da suite de testes:', err);
  process.exit(1);
});
