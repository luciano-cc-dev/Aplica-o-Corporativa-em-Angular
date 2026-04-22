import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Pessoa } from './services/pessoa';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css' // Garanta que o caminho para o CSS está correto
})
export class App implements OnInit {
  // Estado da Aplicação
  public listaDePessoas: any[] = [];
  public usuarioAtual: any = { nome: '', email: '', cpf: '' };
  public editando: boolean = false;

  constructor(
    private service: Pessoa, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  // Busca a lista atualizada na Oracle Cloud
  carregarDados() {
    this.service.listarPessoas().subscribe({
      next: (dados: any) => {
        // A API ORDS retorna os dados dentro de 'items'
        this.listaDePessoas = dados.items || [];
        // Força o Angular a renderizar os novos dados na tela
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao listar:', err)
    });
  }

  // Decide se cria um novo registro (POST) ou atualiza (PUT)
  salvar() {
    if (this.editando) {
      // URL específica para o recurso (exige o CPF no final)
      const urlEdicao = `https://gbebca2c3091cae-internshipdb1.adb.sa-saopaulo-1.oraclecloudapps.com/ords/estagio/pessoa/${this.usuarioAtual.cpf}`;
      
      this.http.put(urlEdicao, this.usuarioAtual).subscribe({
        next: () => {
          alert('Atualizado com sucesso!');
          this.finalizarOperacao();
        },
        error: (err) => console.error('Erro no PUT:', err)
      });
    } else {
      this.service.salvarPessoa(this.usuarioAtual).subscribe({
        next: () => {
          alert('Cadastrado com sucesso!');
          this.finalizarOperacao();
        }
      });
    }
  }

  // Prepara a exclusão via CPF
  excluir(cpf: string) {
    if (confirm('Deseja realmente remover este registro?')) {
      this.service.excluirPessoa(cpf).subscribe({
        next: () => {
          alert('Removido!');
          this.carregarDados();
        }
      });
    }
  }

  // Sobe os dados da tabela para o formulário de edição
  prepararEdicao(pessoa: any) {
    this.editando = true;
    this.usuarioAtual = { ...pessoa }; // Copia o objeto para evitar alteração imediata na tabela
    this.cdr.detectChanges();
  }

  finalizarOperacao() {
    this.limparFormulario();
    this.carregarDados();
  }

  limparFormulario() {
    this.usuarioAtual = { nome: '', email: '', cpf: '' };
    this.editando = false;
    this.cdr.detectChanges();
  }

  cancelarEdicao() {
    this.limparFormulario();
  }
}