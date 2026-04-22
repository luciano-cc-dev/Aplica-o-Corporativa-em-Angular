import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Pessoa {

  private readonly API_URL = 'https://gbebca2c3091cae-internshipdb1.adb.sa-saopaulo-1.oraclecloudapps.com/ords/estagio/pessoa/';

  constructor(private http: HttpClient) { }

  // Função para BUSCAR os dados dathis Oracle
// No pessoa.ts
listarPessoas(): Observable<any> {
  // Adicionamos ?limit=100 para garantir que o seu novo cadastro apareça
  return this.http.get(`${this.API_URL}?limit=100`);
}
salvarPessoa(dados: any): Observable<any> {
  // Tentativa A: Enviar para a URL sem a barra final se estiver criando
  // Tentativa B: Se for edição, a URL precisa do CPF: .../pessoa/123.456...
  const urlFinal = dados.cpf ? `${this.API_URL}${dados.cpf}` : this.API_URL;
  
  // Se o CPF já existe, usamos PUT (Atualizar), se não, usamos POST (Criar)
  // Mas para testar o erro 405, tente primeiro apenas remover a barra se ela estiver sobrando
  return this.http.post(this.API_URL, dados);
}
  // Adicione este método dentro da classe Pessoa
// No arquivo pessoa.ts
// pessoa.ts
excluirPessoa(cpf: string): Observable<any> {
  // Verifique se a API_URL termina com /
  // Se já termina, não coloque outra barra!
  const urlParaDeletar = `${this.API_URL}${cpf}`;
  console.log('Tentando deletar nesta URL:', urlParaDeletar);
  return this.http.delete(urlParaDeletar);
}
}
