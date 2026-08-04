# 📖 FarmaUSF — Guia de Uso da Plataforma e Ferramentas para Cuidado Farmacêutico na APS

Este documento apresenta o guia completo de utilização do **FarmaUSF**, uma plataforma web desenvolvida para apoiar a **Farmácia Clínica e o Cuidado Farmacêutico** no âmbito da **Atenção Primária à Saúde (APS)** e nas **Unidades de Saúde da Família (USF)**.

---

## 📌 Sumário
1. [Visão Geral e Objetivos Clínicos](#1-visão-geral-e-objetivos-clínicos)
2. [Acesso, Autenticação e Perfil Profissional](#2-acesso-autenticação-e-perfil-profissional)
3. [Módulo de Registro Clínico SOAP Integrado](#3-módulo-de-registro-clínico-soap-integrado)
   - [Passo 1: Identificação, Biometria e Sinais Vitais](#passo-1-identificação-biometria-e-sinais-vitais)
   - [Passo 2: Subjetivo (S) & Visita Domiciliar Farmacêutica (VDF)](#passo-2-subjetivo-s--visita-domiciliar-farmacêutica-vdf)
   - [Passo 3: Farmacoterapia & Alertas (Beers e Polifarmácia)](#passo-3-farmacoterapia--alertas-beers-e-polifarmácia)
   - [Passo 4: Avaliação Clínica (A), PRMs/RNMs & Adesão (Morisky)](#passo-4-avaliação-clínica-a-prmsrnms--adesão-morisky)
   - [Passo 5: Plano de Cuidado (P), Exportação e e-SUS PEC](#passo-5-plano-de-cuidado-p-exportação-e-e-sus-pec)
4. [Ferramentas e Calculadoras Clínicas](#4-ferramentas-e-calculadoras-clínicas)
   - [Clearance de Creatinina (Cockcroft-Gault) & Ajuste Renal](#clearance-de-creatinina-cockcroft-gault--ajuste-renal)
   - [Equivalência de Corticoides](#equivalência-de-corticoides)
   - [Equivalência de Estatinas](#equivalência-de-estatinas)
   - [Calculadora Pediátrica & Reconstituição de Suspensões](#calculadora-pediátrica--reconstituição-de-suspensões)
   - [Algoritmo de Desprescrição (Beers AGS & STOPP/START)](#algoritmo-de-desprescrição-beers-ags--stoppstart)
   - [Gerador de Plano Posológico Visual para o Paciente](#gerador-de-plano-posológico-visual-para-o-paciente)
5. [Centro de Informação sobre Medicamentos (CIM) & Educação](#5-centro-de-informação-sobre-medicamentos-cim--educação)
   - [Consulta Rápida RENAME / REMUME](#consulta-rápida-rename--remume)
   - [Guia Interativo de Fitoterapia e Plantas Medicinais do SUS](#guia-interativo-de-fitoterapia-e-plantas-medicinais-do-sus)
   - [Checklist e Auditoria de Armazenamento Domiciliar](#checklist-e-auditoria-de-armazenamento-domiciliar)
6. [Integração em Nuvem (Supabase & Google Sheets)](#6-integração-em-nuvem-supabase--google-sheets)
7. [Boas Práticas e Protocolos de Atendimento](#7-boas-práticas-e-protocolos-de-atendimento)

---

## 1. Visão Geral e Objetivos Clínicos

O **FarmaUSF** é uma ferramenta de apoio à decisão clínica e documentação voltada para farmacêuticos e equipes multiprofissionais da Atenção Primária. Seus principais objetivos são:

- **Sistemática de Registro Clínico**: Padronizar o atendimento através do método **SOAP** (Subjetivo, Objetivo, Avaliação, Plano).
- **Segurança do Paciente**: Identificar precocemente Problemas Relacionados a Medicamentos (PRMs), Medicamentos Potencialmente Inapropriados para Idosos (MPIs/Beers) e ajustar doses em função da taxa de filtração glomerular.
- **Adesão Terapêutica**: Medir e acompanhar a adesão ao tratamento com a escala validada de Morisky (MMAS-4) e gerar esquemas visuais simplificados para pacientes e cuidadores.
- **Integração no SUS**: Facilitar o fluxo de cópia direta de prontuários formatados para o **e-SUS PEC** e permitir a exportação de dados estatísticos de intervenções para o **Google Sheets** e **Supabase Cloud**.

---

## 2. Acesso, Autenticação e Perfil Profissional

Para garantir a privacidade dos dados clínicos e o cumprimento das regulamentações profissionais, o sistema possui controle de acesso por **Controle de Acesso Baseado em Função (RBAC)**.

### 🔐 Como Acessar o Sistema:
1. No canto superior direito, clique em **"Entrar com CPF"**.
2. Digite um **CPF válido com 11 dígitos** (o sistema valida os dígitos verificadores matematicamente).
3. **Primeiro Acesso**:
   - Preencha o formulário de cadastro com seu Nome Completo, Cargo/Profissão e a Unidade de Saúde (USF).
   - Insira o **Código de Autorização Institucional** fornecido pela coordenação (`Privado).
4. **Sessões Subsequentes**: O login reconhece o CPF cadastrado automaticamente (localmente ou via Supabase Cloud).

> ⚠️ **Nota de Segurança**: Apenas usuários autenticados com o perfil de **Farmacêutico(a)** têm autorização para salvar, exportar e manipular os registros clínicos SOAP e cadastrar novas condutas terapêuticas.

---

## 3. Módulo de Registro Clínico SOAP Integrado

O módulo SOAP é estruturado em **5 passos progressivos (Wizard)** para otimizar o tempo de consulta e garantir registros completos.

### Passo 1: Identificação, Biometria e Sinais Vitais
- **Identificação**: Nome/Iniciais do paciente, Idade e Sexo biológico.
- **Antropometria**: Peso (kg) e Altura (m). O sistema calcula dinamicamente o **IMC (Índice de Massa Corporal)** e classifica o estado nutricional.
- **Sinais Vitais & Exames**:
  - **Pressão Arterial (PAS/PAD)**: Alerta imediato de hipertensão (Estágios 1, 2, 3 ou Pré-hipertensão).
  - **Glicemia Capilar/Jejum (mg/dL)**.
  - **Creatinina Sérica (mg/dL)**: Ao informar a creatinina, o sistema calcula automaticamente a **Estimativa de Taxa de Filtração Glomerular (TFG/ClCr Cockcroft-Gault)** e indica o estágio da Doença Renal Crônica (DRC - G1 a G5).

### Passo 2: Subjetivo (S) & Visita Domiciliar Farmacêutica (VDF)
- **Queixas e Relato do Paciente**: Campo livre para digitação das queixas principais, histórico de sintomas e história médica egressa.
- **Modalidade de Atendimento**:
  - **Consulta na USF**: Atendimento ambulatorial padrão.
  - **Visita Domiciliar Farmacêutica (VDF)**: Ao selecionar a opção VDF, campos adicionais são ativados automaticamente:
    - *Motivo da Visita* (ex: acompanhamento pós-alta, suspeita de não-adesão, polifarmácia extrema).
    - *Acompanhado por / Cuidador*.
    - *Avaliação do Ambiente de Armazenamento Domiciliar*.
    - *Estoque e Sobras Caseiras de Medicamentos*.
- **Modelos Rápidos (Templates)**: Botões de clique único para preenchimento rápido em atendimentos de Hipertensão, Diabetes, Polifarmácia e Visitas Domiciliares.

### Passo 3: Farmacoterapia & Alertas (Beers e Polifarmácia)
- **Mapeamento de Medicamentos**: Adicione cada medicamento em uso pelo paciente (com dose e horários: Manhã, Tarde, Noite).
- **Alerta de Polifarmácia**: O sistema aciona um selo de alerta sempre que o número de medicamentos contínuos for igual ou maior que 5 ($\ge 5$).
- **Checagem Automática de Critérios de Beers (AGS 2023)**: O sistema identifica automaticamente medicamentos potencialmente inapropriados para idosos (ex: Glibenclamida, Amitripilina, Diazepam, Omeprazol de uso prolongado) e insere alertas de segurança no prontuário.

### Passo 4: Avaliação Clínica (A), PRMs/RNMs & Adesão (Morisky)
- **Avaliação de PRMs/RNMs**: Permite classificar o Problema Relacionado a Medicamento segundo o Método Dáder (Necessidade, Eficácia, Segurança).
- **Escala de Adesão de Morisky (MMAS-4)**: Teste rápido de 4 perguntas SIM/NÃO que calcula o escore final de adesão (Alta Adesão = 4/4; Média/Baixa Adesão < 4/4).
- **Alertas de Ajuste Renal**: Se o Clearance de Creatinina for $< 60\text{ mL/min}$, o sistema analisa a lista de fármacos e sugere os ajustes de dose necessários (ex: Metformina, Enalapril, Espironolactona, Atenolol).

### Passo 5: Plano de Cuidado (P), Exportação e e-SUS PEC
- **Conduta e Intervenções Farmacêuticas**: Registro estruturado das intervenções realizadas (orientação ao paciente, sugestão de alteração de dose ao médico prescritor, encaminhamento, etc.).
- **Gerador de Texto Formatado e-SUS PEC**: O sistema compila todas as etapas em um texto clínico padronizado. Basta clicar no botão **"Copiar Prontuário"** e colar diretamente no campo de evolução do e-SUS PEC da unidade.
- **Plano Posológico Visual**: Gera uma tabela visual de fácil compreensão com o esquema de tomadas do paciente pronta para impressão ou compartilhamento.

---

## 4. Ferramentas e Calculadoras Clínicas

O FarmaUSF reúne calculadoras com algoritmos consolidados na literatura médica e farmacêutica.

### Clearance de Creatinina (Cockcroft-Gault) & Ajuste Renal
- **Fórmula**: 
  $$\text{ClCr (mL/min)} = \frac{(140 - \text{idade}) \times \text{peso (kg)}}{72 \times \text{Creatinina Sérica (mg/dL)}} \quad [\times 0{,}85 \text{ se feminino}]$$
- **Aplicação**: Determina o estágio da DRC e apresenta um painel de alerta com contraindicações e ajustes posológicos para os medicamentos da RENAME.

### Equivalência de Corticoides
- **Fórmula de Conversão**: Converte doses entre Hidrocortisona, Prednisona, Prednisolona, Metilprednisolona, Dexametasona e Betametasona com base nas equivalências anti-inflamatórias padrão.
- **Utilitário**: Auxilia na transição e desmame seguro de corticoterapia.

### Equivalência de Estatinas
- **Calculadora de Potência**: Permite migrar ou ajustar doses entre Sinvastatina, Atorvastatina e Rosuvastatina, indicando a redução estimada de LDL-c (Baixa, Moderada ou Alta intensidade).

### Calculadora Pediátrica & Reconstituição de Suspensões
- **Cálculo por Peso ($mg/kg/dia$)**: Calcula a dose diária total e o volume em $mL$ a ser administrado em cada tomada para os principais antibióticos e analgésicos infantis do SUS (Amoxicilina, Paracetamol, Dipirona, Ibuprofeno).
- **Guia de Reconstituição**: Passo a passo da quantidade de água purificada e conservação pós-preparo.

### Algoritmo de Desprescrição (Beers AGS & STOPP/START)
- **Ferramenta de Suporte à Decisão**: Guia o farmacêutico na identificação de fármacos duplicados, sem indicação atual ou com risco superior ao benefício, fornecendo estratégias graduais de desmame (tapering).

### Gerador de Plano Posológico Visual para o Paciente
- **Interface Visual**: Converte a lista de medicamentos em um quadro com símbolos visuais de Sol (Manhã), Tarde e Lua (Noite), com cores distintas por comprimido, permitindo que pacientes com baixo letramento em saúde compreendam a prescrição.

---

## 5. Centro de Informação sobre Medicamentos (CIM) & Educação

### Consulta Rápida RENAME / REMUME
- Busca rápida por **Nome Genérico**, **Classe Terapêutica** ou **Indicação**.
- Apresenta orientações de administração, uso na gestação/lactação, principais interações e cuidados de conservação.

### Guia Interativo de Fitoterapia e Plantas Medicinais do SUS
- Catálogo baseado no **Memento de Fitoterápicos da ANVISA** e na Política Nacional de Plantas Medicinais do SUS.
- Apresenta nome popular, nome científico, indicação clínica, método de preparo (infusão, decocção, maceração), posologia recomendada e **alertas graves de interações medicamentosas** (ex: Erva-de-São-João, Capim-Santo, Camomila).

### Checklist e Auditoria de Armazenamento Domiciliar
- Ferramenta interativa para ser aplicada durante Visitas Domiciliares (VDF).
- Avalia itens de risco (ex: guardar em local úmido como banheiro, próximo a luz solar/fogão, insulinas fora de geladeira, medicamentos ao alcance de crianças).
- **Escore de Segurança ($0-100\%$)**: Gera automaticamente um parecer orientativo formatado que pode ser inserido no prontuário SOAP ou entregue ao paciente.

---

## 6. Integração em Nuvem (Supabase & Google Sheets)

O FarmaUSF oferece flexibilidade para operar 100% offline ou conectado à nuvem da unidade de saúde.

### ☁️ Supabase Cloud (Autenticação e Prontuários Centralizados)
- Permite sincronizar os usuários cadastrados e o banco de dados de atendimentos em um servidor seguro em nuvem.
- Para ativar, clique no badge de status do Supabase no modal de login e insira a **URL do projeto** e a **Chave Anônima (Anon Key)**.

### 📊 Exportação de Indicadores para Google Sheets (Apps Script)
- O sistema permite enviar cada consulta finalizada para uma planilha do **Google Sheets** da equipe eSF/eMulti.
- **Indicadores Gerados**: Taxa de controle de PA/Glicemia, número de polifarmácias atendidas, quantidade de PRMs identificados e resolvidos, índice de adesão Morisky e adesão ao uso racional de antibióticos.
- **Configuração**: No Passo 5 do SOAP, clique em *"Exportar para Google Sheets"*, insira a URL do Web App gerada pelo seu Apps Script e salve.

---

## 7. Boas Práticas e Protocolos de Atendimento

1. **Acolhimento e Escuta Ativa**: Inicie o atendimento explicando o papel da consulta farmacêutica na USF.
2. **Checagem da Sacola de Medicamentos ("Brown Bag Test")**: Peça para o paciente trazer todos os medicamentos em uso (prescritos, automedicação, chás e suplementos).
3. **Registro Fiel no e-SUS PEC**: Mantenha os registros sempre atualizados utilizando o gerador SOAP do FarmaUSF para garantir a continuidade do cuidado pela equipe multiprofissional (Médicos, Enfermeiros, Agentes Comunitários de Saúde).
4. **Comunicação Interprofissional**: Ao identificar PRMs graves ou necessidade de desprescrição, emita um parecer fundamentado e discuta o caso na reunião de matrizamento da equipe de Saúde da Família.

---

*FarmaUSF — Desenvolvido para transformar o cuidado farmacêutico na Atenção Primária à Saúde.*
