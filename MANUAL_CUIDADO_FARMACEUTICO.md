# 📖 FarmaUSF — Guia Completo da Plataforma e Manual de Cuidado Farmacêutico na APS

Este manual apresenta a documentação integral do **FarmaUSF**, uma plataforma web clínica e decisória desenvolvida para instrumentalizar o **Cuidado Farmacêutico**, a **Farmácia Clínica** e a integração multiprofissional na **Atenção Primária à Saúde (APS)** e nas **Unidades de Saúde da Família (USF)**.

---

## 📌 Sumário

1. [Visão Geral, Justificativa e Objetivos Clínicos](#1-visão-geral-justificativa-e-objetivos-clínicos)
2. [Acesso, Autenticação e Controle de Acesso (RBAC)](#2-acesso-autenticação-e-controle-de-acesso-rbac)
3. [Módulo de Registro Clínico SOAP Integrado (Wizard em 5 Passos)](#3-módulo-de-registro-clínico-soap-integrado-wizard-em-5-passos)
   - [Passo 1: Identificação, Biometria, Sinais Vitais & Testes Rápidos Point-of-Care](#passo-1-identificação-biometria-sinais-vitais--testes-rápidos-point-of-care)
   - [Passo 2: Subjetivo (S), Histórico & Visita Domiciliar Farmacêutica (VDF)](#passo-2-subjetivo-s-histórico--visita-domiciliar-farmacêutica-vdf)
   - [Passo 3: Farmacoterapia, Conciliação, Alertas de Segurança & Calendário de Renovação](#passo-3-farmacoterapia-conciliação-alertas-de-segurança--calendário-de-renovação)
   - [Passo 4: Avaliação Clínica (A), PRMs/RNMs & Adesão Terapêutica (Morisky MMAS-4)](#passo-4-avaliação-clínica-a-prmsrnms--adesão-terapêutica-morisky-mmas-4)
   - [Passo 5: Plano de Cuidado (P), Códigos Oficiais SUS & Emissão de Documentos](#passo-5-plano-de-cuidado-p-códigos-oficiais-sus--emissão-de-documentos)
4. [Documentos Clínicos Oficiais e Integração com o e-SUS PEC](#4-documentos-clínicos-oficiais-e-integração-com-o-e-sus-pec)
   - [Texto Estruturado para Prontuário e-SUS PEC](#texto-estruturado-para-prontuário-e-sus-pec)
   - [Declaração de Serviço Farmacêutico (DSF - Resolução CFF nº 585/2013)](#declaração-de-serviço-farmacêutico-dsf---resolução-cff-nº-5852013)
   - [Parecer Técnico & Matriciamento Interprofissional (eSF / eMulti)](#parecer-técnico--matriciamento-interprofissional-esf--emulti)
   - [Laudo de Triagem e Testes Rápidos Point-of-Care (RDC Anvisa nº 786/2023)](#laudo-de-triagem-e-testes-rápidos-point-of-care-rdc-anvisa-nº-7862023)
   - [Plano Posológico Visual Acessível (Baixo Letramento em Saúde)](#plano-posológico-visual-acessível-baixo-letramento-em-saúde)
   - [Hub de Códigos Oficiais SUS (SIGTAP, CIAP-2 e CID-10)](#hub-de-códigos-oficiais-sus-sigtap-ciap-2-e-cid-10)
5. [Protocolos Clínicos e Fluxogramas Interativos de Decisão](#5-protocolos-clínicos-e-fluxogramas-interativos-de-decisão)
   - [Hipertensão Arterial Sistêmica (Diretrizes SBC / MS)](#hipertensão-arterial-sistêmica-diretrizes-sbc--ms)
   - [Diabetes Mellitus Tipo 2 (Diretrizes SBD)](#diabetes-mellitus-tipo-2-diretrizes-sbd)
   - [Asma Brônquica (PCDT MS / GINA)](#asma-brônquica-pcdt-ms--gina)
   - [Doença Pulmonar Obstrutiva Crônica - DPOC (GOLD / PCDT SUS)](#doença-pulmonar-obstrutiva-crônica---dpoc-gold--pcdt-sus)
   - [Dislipidemias e Prevenção Cardiovascular (SBC)](#dislipidemias-e-prevenção-cardiovascular-sbc)
   - [Uso Racional de Antimicrobianos na APS](#uso-racional-de-antimicrobianos-na-aps)
   - [Serviços Farmacêuticos na Atenção Básica (Caderno de Atenção Básica nº 1)](#serviços-farmacêuticos-na-atenção-básica-caderno-de-atenção-básica-nº-1)
   - [Avaliação do Pé Diabético — IWGDF / SBD 2024](#avaliação-do-pé-diabético--iwgdf--sbd-2024)
   - [Transição da Insulina NPH para Glargina U-100 — SBD 2024](#transição-da-insulina-nph-para-glargina-u-100--sbd-2024)
6. [Ferramentas e Calculadoras Clínicas com Ajuste Posológico](#6-ferramentas-e-calculadoras-clínicas-com-ajuste-posológico)
   - [Clearance de Creatinina (Cockcroft-Gault) & Painel de Ajuste Renal](#clearance-de-creatinina-cockcroft-gault--painel-de-ajuste-renal)
   - [Filtração Glomerular Estimada (CKD-EPI 2021)](#filtração-glomerular-estimada-ckd-epi-2021)
   - [Risco de Sangramento (Escore HAS-BLED)](#risco-de-sangramento-escore-has-bled)
   - [Risco Tromboembólico em Fibrilação Atrial (CHA₂DS₂-VASc)](#risco-tromboembólico-em-fibrilação-atrial-cha₂ds₂-vasc)
   - [Antropometria Clínica: IMC, Peso Ideal & Peso Ajustado](#antropometria-clínica-imc-peso-ideal--peso-ajustado)
   - [Superfície Corporal (BSA - Mosteller) & Dosagem Total](#superfície-corporal-bsa---mosteller--dosagem-total)
   - [Teste de Controle da Asma (ACT) & Pico de Fluxo Expiratório (PFE)](#teste-de-controle-da-asma-act--pico-de-fluxo-expiratório-pfe)
   - [Equivalência de Corticoides & Equivalência de Estatinas](#equivalência-de-corticoides--equivalência-de-estatinas)
   - [Calculadora Pediátrica & Reconstituição de Suspensões](#calculadora-pediátrica--reconstituição-de-suspensões)
   - [Algoritmo de Desprescrição Clínica (Beers AGS 2023 & STOPP/START)](#algoritmo-de-desprescrição-clínica-beers-ags-2023--stoppstart)
   - [Histórico e Envio Direto de Resultados para o SOAP](#histórico-e-envio-direto-de-resultados-para-o-soap)
7. [Centro de Informação sobre Medicamentos (CIM) & Interações](#7-centro-de-informação-sobre-medicamentos-cim--interações)
   - [Consulta Rápida RENAME / REMUME com Filtros Dinâmicos](#consulta-rápida-rename--remume-com-filtros-dinâmicos)
   - [Matriz de Compatibilidade e Interações Farmacológicas](#matriz-de-compatibilidade-e-interações-farmacológicas)
8. [Educação em Saúde, Fitoterapia e Práticas Comunitárias](#8-educação-em-saúde-fitoterapia-e-práticas-comunitárias)
   - [Guia Interativo de Fitoterapia e Plantas Medicinais do SUS](#guia-interativo-de-fitoterapia-e-plantas-medicinais-do-sus)
   - [Checklist e Auditoria de Armazenamento Domiciliar (Escore de Segurança)](#checklist-e-auditoria-de-armazenamento-domiciliar-escore-de-segurança)
   - [Manejo de Dispositivos Inalatórios & Plano de Ação Escrito para Asma](#manejo-de-dispositivos-inalatórios--plano-de-ação-escrito-para-asma)
   - [Biblioteca de Procedimentos Operacionais Padrão (POPs) da Farmácia na APS](#biblioteca-de-procedimentos-operacionais-padrão-pops-da-farmácia-na-aps)
   - [Guia do Calendário Nacional de Vacinação (PNI / SUS)](#guia-do-calendário-nacional-de-vacinação-pni--sus)
9. [Dashboard de Gestão & Espelho de Produção SUS](#9-dashboard-de-gestão--espelho-de-produção-sus)
   - [Indicadores Clínicos e Farmacoepidemiológicos](#indicadores-clínicos-e-farmacoepidemiológicos)
   - [Espelho de Produção SUS (Conferência com e-SUS PEC e SISAB)](#espelho-de-produção-sus-conferência-com-e-sus-pec-e-sisab)
   - [Exportação de Relatório SIGTAP (CSV)](#exportação-de-relatório-sigtap-csv)
10. [Integração em Nuvem & Armazenamento (Supabase & Google Sheets)](#10-integração-em-nuvem--armazenamento-supabase--google-sheets)
    - [Supabase Cloud (Autenticação RBAC e Banco de Dados Clínico)](#supabase-cloud-autenticação-rbac-e-banco-de-dados-clínico)
    - [Exportação de Indicadores para Google Sheets (Apps Script)](#exportação-de-indicadores-para-google-sheets-apps-script)
    - [Operação Híbrida e Resiliência Offline (LocalStorage)](#operação-híbrida-e-resiliência-offline-localstorage)
11. [Boas Práticas, Ética Farmacêutica e Fluxo na USF](#11-boas-práticas-ética-farmacêutica-e-fluxo-na-usf)

---

## 1. Visão Geral, Justificativa e Objetivos Clínicos

Na Atenção Primária à Saúde (APS), os usuários frequentemente convivem com múltiplas condições crônicas não transmissíveis (como hipertensão arterial sistêmica, diabetes mellitus tipo 2, dislipidemia e osteoartrite), demandando regimes terapêuticos complexos e polifarmácia contínua. 

O **FarmaUSF** foi concebido para empoderar a atuação do farmacêutico clínico na Estratégia de Saúde da Família (eSF) e nas equipes multiprofissionais (eMulti), integrando suporte decisório à beira do leito/consultório, segurança terapêutica e conformidade regulatória.

### 🎯 Principais Objetivos Clínicos:
- **Padronização da Evolução Clínica**: Estruturar a consulta farmacêutica pelo método **SOAP (Subjetivo, Objetivo, Avaliação e Plano)**, promovendo consistência técnica e continuidade do cuidado.
- **Rastreamento Precoce de Riscos Farmacoterapêuticos**: Identificar automaticamente Problemas Relacionados a Medicamentos (PRMs), Medicamentos Potencialmente Inapropriados para Idosos (MPIs - Critérios de Beers AGS 2023) e necessidade de ajuste em disfunção renal.
- **Promoção da Adesão Terapêutica e Letramento em Saúde**: Instrumentar a avaliação da adesão por escalas validadas (Morisky-Green / MMAS-4) e gerar materiais visuais acessíveis (cronogramas com ícones e cores).
- **Rastreabilidade Sanitária em Testes Rápidos Point-of-Care**: Cumprir integralmente as exigências da **RDC Anvisa nº 786/2023**, vinculando lote, validade, interpretação técnica e emissão de laudo formal.
- **Integração Real ao Sistema Único de Saúde (SUS)**: Permitir a transposição direta da evolução formatada para o **e-SUS PEC**, com vinculação explícita de procedimentos faturáveis/registráveis da Tabela **SIGTAP**, condições da **CIAP-2** e diagnósticos **CID-10**.

---

## 2. Acesso, Autenticação e Controle de Acesso (RBAC)

O sistema conta com mecanismo de **Controle de Acesso Baseado em Função (RBAC - Role-Based Access Control)** para proteger o sigilo profissional, a integridade dos prontuários e assegurar as atribuições privativas de cada categoria profissional.

```
       ┌────────────────────────────────────────────────────────┐
       │                   Acesso ao FarmaUSF                   │
       └───────────────────────────┬────────────────────────────┘
                                   │ Digitar CPF (Validação de 11 dígitos)
                                   ▼
                   ┌───────────────────────────────┐
                   │    Usuário já cadastrado?     │
                   └───────┬───────────────┬───────┘
                       Sim │               │ Não
                           │               ▼
                           │  Digitar Código Institucional Privado:
                           │  • Farmacêuticos: FARMA... / FAR-... / UEMS-FAR...
                           │  • Médicos: MED... / MED-...
                           │  • Enfermeiros: ENF... / ENF-...
                           │  • Residentes: RES... / RES-...
                           │  • Equipe Geral: EQUIPE... / USF...
                           │               │
                           ▼               ▼
       ┌────────────────────────────────────────────────────────┐
       │        Autenticação Concluída & Perfil Liberado        │
       │  (Acesso ao SOAP restrito ao perfil de Farmacêutico)   │
       └────────────────────────────────────────────────────────┘
```

### 🔐 Diretrizes de Acesso:
1. **Entrada por CPF**: O usuário clica no botão superior *"Entrar com CPF"* e informa um número de CPF válido (com verificação algorítmica dos dígitos verificadores).
2. **Primeiro Acesso & Validação de Token**:
   - É solicitado o preenchimento de Nome Completo, Cargo, E-mail, Senha e Unidade de Saúde (USF).
   - O campo **Código de Autorização Institucional** valida a função do usuário por meio de prefixos institucionais concedidos pela coordenação:
     - `FARMA` ou `UEMS-FAR`: Credencia o perfil com privilégios plenos de **Farmacêutico(a)**, liberando a evolução SOAP, registro de condutas e emissão de laudos.
     - `MED`: Credencia o perfil de **Médico(a)**.
     - `ENF`: Credencia o perfil de **Enfermeiro(a)**.
     - `RES`: Credencia o perfil de **Residente Multiprofissional**.
     - `EQUIPE` ou `USF`: Credencia membros da **Equipe Multiprofissional**.
3. **Persistência de Sessão**: A sessão é armazenada no navegador localmente e sincronizada com o **Supabase Auth** quando configurado.
4. **Proteção do Prontuário SOAP**: Apenas usuários autenticados com o perfil de Farmacêutico possuem permissão para salvar consultas, exportar dados para nuvem e emitir pareceres de matriciamento.

---

## 3. Módulo de Registro Clínico SOAP Integrado (Wizard em 5 Passos)

O prontuário SOAP foi planejado em um fluxo guiado de 5 etapas (Wizard), otimizando a consulta presencial ou domiciliar e minimizando lacunas de informação.

---

### Passo 1: Identificação, Biometria, Sinais Vitais & Testes Rápidos Point-of-Care

- **Identificação do Paciente**: Nome completo ou iniciais, Idade em anos e Sexo biológico (parâmetro essencial para cálculo de fórmulas renais e antropometria).
- **Dados Antropométricos**:
  - Peso ($kg$) e Altura ($m$).
  - O sistema calcula automaticamente o **Índice de Massa Corporal (IMC)** e classifica o estado nutricional conforme os pontos de corte da OMS e OPAS para idosos.
- **Sinais Vitais e Marcadores Laboratoriais de Rotina**:
  - **Pressão Arterial (PAS / PAD em mmHg)**: Classificação instantânea (Ótima, Normal, Pré-hipertensão, Hipertensão Estágio 1, 2 ou 3).
  - **Glicemia Capilar (mg/dL)**: Diferenciação entre estado de Jejum ($\ge 8h$) e Casual/Pós-prandial ($2h$), emitindo alertas para hipoglicemia ($< 70\text{ mg/dL}$) ou hiperglicemia franca.
  - **Creatinina Sérica (mg/dL)**: Alimenta o cálculo automático da **Taxa de Filtração Glomerular (ClCr Cockcroft-Gault)**, estadiando o risco de Doença Renal Crônica (G1 a G5).
  - **Parâmetros Respiratórios**: Saturação Periférica de Oxigênio ($SpO_2\%$), Frequência Respiratória ($irpm$) e Pico de Fluxo Expiratório ($PFE\text{ L/min}$).
- **Módulo de Testes Rápidos Point-of-Care (RDC Anvisa nº 786/2023)**:
  - Seleção dinâmica entre os testes preconizados na APS: *Glicemia Capilar*, *Hemoglobina Glicada (HbA1c)*, *Perfil Lipídico (Colesterol Total, TG, HDL)*, *Sífilis*, *HIV 1/2*, *Teste de Gravidez (Beta-hCG Urinário)*, *Dengue (NS1/IgM/IgG)*, **Hepatite C (Anti-HCV)** e **Chikungunya/Zika (IgM/IgG)**.
  - **Rastreabilidade Sanitária Obrigatória**: Campos para inserção de **Lote**, **Data de Validade** e **Fabricante do Kit**.
  - **Geração do Resultado e Conduta**: Interpretação em tempo real com orientações de conduta clínica imediata e botão para emitir o Laudo POC em PDF/impressão.

---

### Passo 2: Subjetivo (S), Histórico & Visita Domiciliar Farmacêutica (VDF)

- **Queixas Principais e Relato Espontâneo**: Campo aberto para anotação detalhada da percepção do paciente, histórico da moléstia atual, sintomas gastrointestinais, cefaleia, tonturas ou outras queixas.
- **Modalidade do Atendimento**:
  - **Consulta Ambulatorial na UBS**: Atendimento na sala de acolhimento ou consultório da farmácia.
  - **Visita Domiciliar Farmacêutica (VDF)**: Ao marcar a opção VDF, o sistema ativa uma seção especializada:
    - *Motivo Específico da Visita* (pós-alta hospitalar, suspeita de intoxicação, paciente acamado/restrito ao domicílio, polifarmácia complexa).
    - *Identificação do Cuidador ou Familiar Responsável*.
    - *Avaliação do Ambiente de Armazenamento* (exposição a calor na cozinha, umidade no banheiro, luminosidade excessiva).
    - *Identificação de Sobras de Tratamentos Anteriores e Medicamentos Vencidos*.
    - *Botão de Acesso ao Checklist de Armazenamento Domiciliar*, que calcula o Escore de Risco Sanitário Residencial ($0-100\%$).
- **Templates de Preenchimento Rápido**: Botões de 1 clique para injetar estruturas textuais padrão para:
  - Hipertensão Arterial Sistêmica;
  - Diabetes Mellitus Descompensado;
  - Polifarmácia e Idoso Frágil;
  - Visita Domiciliar Farmacêutica Padrão.

---

### Passo 3: Farmacoterapia, Conciliação, Alertas de Segurança & Calendário de Renovação

- **Mapeamento Posológico Individualizado**: Inclusão de cada fármaco prescrito ou de automedicação:
  - Nome do Fármaco e Concentração;
  - Posologia e Via de Administração;
  - Distribuição nos Horários do Dia (Manhã, Tarde, Noite, Ao Deitar);
  - Quantidade dispensada na farmácia da USF.
- **Calculadora Automática de Duração do Tratamento & Data de Renovação**:
  - Com base na quantidade fornecida e na dose diária, o FarmaUSF calcula a quantidade exata de dias de suprimento e informa a **Data Prevista para Término**.
  - Emite alerta visual preventivo para que o paciente agende a renovação de receita antes que ocorra descontinuidade do tratamento.
- **Detecção Automática de Polifarmácia**: Acionamento automático de alerta quando o número de fármacos de uso contínuo é $\ge 5$, acionando o rastreamento prioritário de interações.
- **Rastreamento dos Critérios de Beers (AGS 2023) & Medicamentos Potencialmente Inapropriados (MPIs)**:
  - Varredura de medicamentos de alto risco em idosos: benzodiazepínicos de meia-vida longa, sulfonilureias de 1ª geração (glibenclamida), anti-inflamatórios não esteroidais (AINEs contínuos), inibidores da bomba de prótons por tempo prolongado sem indicação e antidepressivos tricíclicos (amitriptilina).
  - Alerta detalhado justificando a contraindicação e sugerindo alternativa terapêutica de menor risco.

---

### Passo 4: Avaliação Clínica (A), PRMs/RNMs & Adesão Terapêutica (Morisky MMAS-4)

- **Classificação de PRMs (Problemas Relacionados a Medicamentos - Método Dáder)**:
  - **Necessidade**: Medicamento não necessário ou Problema de saúde não tratado.
  - **Eficácia**: Ineficácia quantitativa (subdose) ou ineficácia não quantitativa.
  - **Segurança**: Insegurança quantitativa (sobredose/toxicidade) ou insegurança não quantitativa (reação adversa / contraindicação).
- **Escala de Adesão Farmacoterapêutica de Morisky-Green (MMAS-4)**:
  1. *O paciente esquece de tomar os remédios em algum momento?*
  2. *É descuidado com o horário da tomada dos medicamentos?*
  3. *Quando se sente melhor, costuma parar de tomar os remédios?*
  4. *Quando se sente pior ao tomar o remédio, para de tomar por conta própria?*
  - **Escore Automático**:
    - **4 pontos (100% respostas favoráveis)**: Alta Adesão.
    - **Menos de 4 pontos**: Média ou Baixa Adesão (ativação do protocolo de apoio e emissão obrigatória do Plano Posológico Visual).
- **Varredura de Ajuste de Dose em Função da Taxa de Filtração Glomerular**:
  - Se o $ClCr < 60\text{ mL/min}$, o sistema compara a prescrição com o guia de nefrologia e emite alertas automáticos para medicamentos como:
    - *Metformina*: Reduzir dose se ClCr $30-45\text{ mL/min}$; suspender se $< 30\text{ mL/min}$ pelo risco de acidose lática.
    - *Enalapril / Captopril*: Ajustar dose e monitorar risco de hipercalemia.
    - *Espironolactona*: Risco elevado de hipercalemia severa em $ClCr < 30\text{ mL/min}$.
    - *Alopurinol, Atenolol, Hidroclorotiazida*.

---

### Passo 5: Plano de Cuidado (P), Códigos Oficiais SUS & Emissão de Documentos

- **Intervenções Farmacêuticas Pactuadas**:
  - Seleção ou redação das condutas adotadas: educação em saúde sobre horários, conciliação de horários de tomadas, proposta de desprescrição, substituição de medicamentos, solicitação de exames de monitoramento.
- **Hub Integrado de Códigos e-SUS PEC (SIGTAP & CIAP-2)**:
  - Seleção em clique único dos códigos oficiais para registro direto no prontuário.
- **Central de Emissão de Documentos**:
  - **Copiar p/ e-SUS PEC**: Copia a evolução em texto clínico estruturado com quebras limpas e códigos para colar diretamente no prontuário eletrônico.
  - **Declaração de Serviço Farmacêutico (DSF)**: Modal de impressão para entrega em mãos ao cidadão.
  - **Parecer Interprofissional / Matriciamento eSF**: Carta formal de recomendação técnica para o médico e enfermeiro da equipe.
  - **Plano Posológico Visual**: Tabela gráfica de administração pronta para impressão.
  - **Exportar para Google Sheets**: Envia a consulta e seus indicadores para a planilha em nuvem da equipe de saúde.

---

## 4. Documentos Clínicos Oficiais e Integração com o e-SUS PEC

O FarmaUSF gera documentação técnica e legal fundamentada nas resoluções vigentes do Conselho Federal de Farmácia (CFF) e do Ministério da Saúde.

```
       ┌────────────────────────────────────────────────────────┐
       │                 Consulta SOAP Concluída                │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   e-SUS PEC      │      │    Declaração    │      │     Parecer      │
│ Texto Formatado  │      │   de Serviço (DSF│      │   Interprofis.   │
│ (SIGTAP/CIAP-2)  │      │ (Res. CFF 585/13)│      │  (eSF / eMulti)  │
└──────────────────┘      └──────────────────┘      └──────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ Laudo Triagem POC│      │ Plano Posológico │      │  Google Sheets   │
│(RDC Anvisa 786)  │      │ Visual Ilustrado │      │ (Apps Script BD) │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### Texto Estruturado para Prontuário e-SUS PEC
Gera a compilação do registro no formato canônico do Ministério da Saúde:
- `[S] SUBJETIVO`: Queixas relatadas, relato de adesão e modalidade de atendimento (USF ou VDF).
- `[O] OBJETIVO`: Sinais vitais aferidos (PA, Glicemia, IMC, Parâmetros Respiratórios), exames POC com lote/validade, creatinina e ClCr estimado.
- `[FARMACOTERAPIA]`: Lista completa de fármacos, doses, intervalos e alertas de segurança identificados (Beers/Polifarmácia).
- `[A] AVALIAÇÃO`: Diagnóstico farmacoterapêutico (PRMs/RNMs), escore de Morisky e classificação do controle metabólico/pressórico.
- `[P] PLANO DE CUIDADO`: Condutas farmacêuticas, encaminhamentos, metas pactuadas e data de aprazamento do retorno.
- `[CÓDIGOS e-SUS PEC]`: Códigos SIGTAP faturáveis e códigos CIAP-2 de problemas/condições.

### Declaração de Serviço Farmacêutico (DSF - Resolução CFF nº 585/2013)
- Documento emitido ao final da consulta, entregue impresso ao paciente ou seu responsável legal.
- Contém cabeçalho formal da Unidade de Saúde, dados do usuário, tabela de parâmetros biológicos aferidos na data (PA, Glicemia, IMC, SpO2), lista dos medicamentos conciliados, orientações não farmacológicas e espaço para assinatura e carimbo do Farmacêutico (CRF).

### Parecer Técnico & Matriciamento Interprofissional (eSF / eMulti)
- Instrumento formal de comunicação entre o farmacêutico e o médico/enfermeiro da equipe de Saúde da Família.
- Utilizado para comunicar suspeitas de reações adversas graves, interações medicamentosas de relevância clínica, necessidade de desprescrição de MPIs (Critérios de Beers) ou necessidade de ajuste renal por taxa de filtração glomerular reduzida.
- Apresenta a fundamentação técnica baseada em evidências, sugere condutas alternativas viáveis na RENAME/REMUME e reserva campo de devolutiva para o médico prescritor.

### Laudo de Triagem e Testes Rápidos Point-of-Care (RDC Anvisa nº 786/2023)
- Documento comprobatório de realização de teste rápido diagnóstico executado no Serviço de Saúde.
- Registra obrigatoriamente: Identificação do cidadão, nome do teste, metodologia diagnóstica, número de lote do kit, data de validade do kit, fabricante, data e hora da coleta, resultado nominal/numérico e nota técnica interpretativa alertando que testes de triagem requerem correlação médica e confirmação laboratorial quando aplicável.

### Plano Posológico Visual Acessível (Baixo Letramento em Saúde)
- Tabela esquemática com ícones de **Sol** (Manhã), **Tarde** e **Lua** (Noite/Ao deitar), acompanhada de código de cores e descrição textual simplificada.
- Projetada especificamente para usuários idosos, analfabetos ou com baixa escolaridade, garantindo a autonomia e prevenindo confusões de dosagem.

### Hub de Códigos Oficiais SUS (SIGTAP, CIAP-2 e CID-10)

| Código | Tabela | Descrição Oficial no SUS | Aplicação Clínica |
| :--- | :--- | :--- | :--- |
| **`01.01.01.003-6`** | SIGTAP | Consulta / Atendimento Farmacêutico | Consulta clínica individual do farmacêutico na USF |
| **`02.14.01.001-5`** | SIGTAP | Teste Rápido de Glicemia Capilar | Rastreamento e monitoramento de DM na farmácia |
| **`03.01.10.003-9`** | SIGTAP | Aferição de Pressão Arterial | Medição de PA sistólica e diastólica |
| **`01.01.02.003-1`** | SIGTAP | Visita Domiciliar por Profissional Nível Superior | Realização de Visita Domiciliar Farmacêutica (VDF) |
| **`02.14.01.004-0`** | SIGTAP | Teste Rápido Imunocromatográfico | Triagem de HIV, Sífilis, Dengue ou Beta-hCG |
| **`01.01.01.002-8`** | SIGTAP | Acolhimento à Demanda Espontânea | Escuta inicial e orientação na farmácia da UBS |
| **`T90`** | CIAP-2 | Diabetes não-insulino/insulino dependente | Condição de rastreio ou acompanhamento de DM |
| **`K86`** | CIAP-2 | Hipertensão arterial sem complicações | Acompanhamento de hipertenso na APS |
| **`P17`** | CIAP-2 | Uso indevido de medicação / Não-adesão | Baixa adesão ou erro de administração |
| **`A98`** | CIAP-2 | Medicina preventiva / Manutenção da saúde | Acompanhamento preventivo e uso racional |
| **`T93`** | CIAP-2 | Hiperlipidemia / Dislipidemia | Pacientes em terapia com Estatinas |
| **`R96`** | CIAP-2 | Asma brônquica / DPOC | Avaliação do uso de dispositivos inalatórios |
| **`U99`** | CIAP-2 | Doença Renal Crônica / Outras doenças renais | Ajuste de posologia por insuficiência renal |
| **`A85`** | CIAP-2 | Efeito adverso de medicamento / Reação adversa | Suspeita de RAM identificada na consulta |

---

## 5. Protocolos Clínicos e Fluxogramas Interativos de Decisão

A aba **Protocolos** reúne fluxogramas interativos onde o profissional responde perguntas sequenciais de *"Sim"* ou *"Não"* sobre o quadro clínico do paciente, sendo guiado até uma conduta terapêutica fundamentada nas diretrizes oficiais.

```
       ┌────────────────────────────────────────────────────────┐
       │              Módulo de Protocolos Clínicos             │
       └───────────────────────────┬────────────────────────────┘
                                   │ Escolha do Algoritmo Clínico
         ┌──────────────┬──────────┴───┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼              ▼
    Hipertensão      Diabetes         Asma           DPOC       Dislipidemia
     (SBC 2020)     (SBD 2023)    (GINA/PCDT)    (GOLD/PCDT)     (SBC 2023)
         │              │              │              │              │
         └──────────────┴──────────────┼──────────────┴──────────────┘
                                       ▼
                       Árvore de Decisão Interativa
                     (Perguntas Sim/Não Passo a Passo)
                                       │
                                       ▼
                       Conduta Terapêutica Baseada em
                      Metas Clínicas e Fármacos RENAME
```

### Hipertensão Arterial Sistêmica (Diretrizes SBC / MS)
- **Classificação**: Normal, Pré-hipertensão, HAS Estágio 1, 2 e 3.
- **Estratificação de Risco**: Avaliação de lesão em órgão-alvo (LOA), risco cardiovascular global e comorbidades.
- **Primeira Linha**: Diuréticos Tiazídicos (Clortalidona / HCTZ), IECAs (Enalapril), BRAs (Losartana) e Bloqueadores dos Canais de Cálcio (Anlodipino).
- **Metas**: $< 140/90\text{ mmHg}$ na população geral; $< 130/80\text{ mmHg}$ em alto risco cardiovascular e diabéticos.

### Diabetes Mellitus Tipo 2 (Diretrizes SBD)
- **Metas**: $HbA1c < 7{,}0\%$ na maioria dos adultos; $< 8{,}0\%$ em idosos frágeis; Glicemia de jejum $< 100\text{ mg/dL}$; Pós-prandial $< 160\text{ mg/dL}$.
- **Fluxo Terapêutico**: Mudança de Estilo de Vida (MEV) + Metformina como droga de primeira linha.
- **Escalonamento**: Adição de Sulfonilureias (Gliclazida / Glibenclamida), inibidores de SGLT2 (conforme protocolo local) ou introdução de Insulina NPH bed-time se falha terapêutica ou descompensação aguda.

### Asma Brônquica (PCDT MS / GINA)
- **Avaliação de Controle**: Frequência de sintomas diurnos, despertares noturnos, limitação de atividades e necessidade de resgate.
- **Tratamento Escalonado**:
  - Etapas 1 e 2: Corticoide inalatório (Budesonida ou Beclometasona) em baixas doses;
  - Etapa 3: Adição de LABA (Formoterol) ou aumento da dose de CI;
  - Resgate: Salbutamol inalatório ou Budesonida + Formoterol conforme estratégia MART.

### Doença Pulmonar Obstrutiva Crônica - DPOC (GOLD / PCDT SUS)
- **Classificação de Grupos**: Avaliação de sintomas (escala mMRC / CAT) e histórico de exacerbações nos últimos 12 meses (Grupos A, B e E).
- **Conduta**: Broncodilatadores de longa ação (LAMA / LABA). Corticoides inalatórios restritos a pacientes com eosinofilia sérica ($\ge 300\text{ células/\mu L}$) ou exacerbações frequentes.

### Dislipidemias e Prevenção Cardiovascular (SBC)
- **Estratificação de Risco**: Muito Alto Risco, Alto Risco, Intermediário e Baixo Risco Cardiovascular.
- **Metas de LDL-c**:
  - Muito Alto Risco: $LDL < 50\text{ mg/dL}$;
  - Alto Risco: $LDL < 70\text{ mg/dL}$;
  - Risco Intermediário: $LDL < 100\text{ mg/dL}$;
  - Baixo Risco: $LDL < 130\text{ mg/dL}$.
- **Escolha da Estatina**: Sinvastatina 20–40 mg (potência moderada, redução de 30–50% do LDL) ou Atorvastatina (alta potência, redução $> 50\%$).

### Uso Racional de Antimicrobianos na APS
- Suporte decisório para infecções prevalentes: Infecção do Trato Urinário (ITU não complicada em mulheres), Faringoamigdalite bacteriana (Critérios de Centor $\ge 3$) e Otite Média Aguda.
- Alerta contra o uso abusivo de antimicrobianos em afecções virais (resfriados, bronquiolites e sinusites agudas iniciais).

### Serviços Farmacêuticos na Atenção Básica (Caderno de Atenção Básica nº 1)
- Fluxograma de acolhimento na farmácia, triagem para consulta farmacêutica, acompanhamento farmacoterapêutico continuado e articulação com as reuniões de equipe eSF/eMulti.

### Avaliação do Pé Diabético — IWGDF / SBD 2024

> [!IMPORTANT]
> O exame do pé deve ser realizado **pelo menos 1 vez por ano** em todos os pacientes com diabetes. Pacientes com risco moderado ou alto devem ser avaliados com maior frequência (a cada 1–6 meses). A maioria das amputações em diabéticos é prevenível com rastreamento oportuno.

O fluxograma interativo de **Avaliação do Pé Diabético** guia o farmacêutico clínico na aplicação do protocolo IWGDF, estratificando o risco e direcionando as condutas:

- **Inspeção Visual** (realizada com calçado retirado): coloração da pele, fissuras, hiperqueratose, deformidades (hálux valgo, dedos em garra, pé de Charcot) e estado das unhas.
- **Teste com Monofilamento de Semmes-Weinstein (10g / 5,07)**: aplicado em 4 pontos plantares com olhos fechados. **2 ou mais falhas = Perda de Sensibilidade Protetora (PSP) confirmada**.
- **Avaliação Vascular**: palpação dos pulsos pedioso e tibial posterior. Pulso diminuído/ausente = suspeita de Doença Arterial Periférica (DAP).
- **Estratificação de Risco IWGDF**:

| Risco | Critério | Frequência de Revisão |
| :--- | :--- | :--- |
| **0 — Baixo** | Sem neuropatia e sem DAP | Anual |
| **1 — Moderado** | Neuropatia OU DAP | 3–6 meses |
| **2 — Alto** | Neuropatia + DAP e/ou deformidade | 1–3 meses |
| **3 — Muito Alto** | Úlcera ativa OU amputação prévia | Encaminhamento urgente |

- **Educação em Saúde Preventiva**: inspeção diária dos pés (espelho/celular), hidratação com ureia 10% (exceto entre dedos), calçado fechado sem costuras internas, corte das unhas reto. **Contraindicado:** andar descalço, bolsas de água quente, remoção caseira de calos.
- **Código SIGTAP**: `01.01.01.003-6` | **CIAP-2**: `T89` (Complicação de Diabetes)
- **POP associado**: `POP-FAR-06` (Avaliação do Pé Diabético e Prevenção de Amputações)

### Transição da Insulina NPH para Glargina U-100 — SBD 2024

> [!NOTE]
> A Insulina Glargina é disponibilizada pelo **Componente Especializado da Assistência Farmacêutica (CEAF)** mediante laudo médico e processo administrativo na Farmácia de Alto Custo da SESAU. Não está disponível na farmácia básica da USF.

O protocolo farmacêutico de **Transição NPH → Glargina** orienta a conversão segura com base no algoritmo TREAT-TO-TARGET das Diretrizes SBD 2024:

**Indicações para transição:**
- Hipoglicemia noturna ou ao amanhecer (Fenômeno do Alvorecer) recorrente com NPH
- Variabilidade glicêmica intensa apesar de boa adesão e técnica de aplicação
- Dificuldade de adesão ao esquema de 2 aplicações diárias de NPH

**Regra de Conversão de Dose:**

| Esquema NPH atual | Dose inicial de Glargina |
| :--- | :--- |
| NPH **1 dose** ao deitar | Mesma dose (proporção **1:1**) ao deitar |
| NPH **2 doses** (manhã + noite) | **80% da dose total diária** de NPH em dose única |

**Exemplo prático:** NPH 20 UI manhã + 10 UI noite (total 30 UI) → Glargina **24 UI** ao deitar.

**Algoritmo de Titulação (TREAT-TO-TARGET):**
- Meta: Glicemia de Jejum entre **80–130 mg/dL**
- Aumentar **+2 UI** a cada 3 dias se jejum persistir > 130 mg/dL
- Reduzir **−2 UI** se jejum < 80 mg/dL em 2 dias consecutivos **ou** qualquer hipoglicemia < 70 mg/dL

**Orientações Clínicas Essenciais ao Paciente:**
- Glargina é uma solução **cristalina transparente** — **NÃO homogeneizar** (diferente da NPH leitosa)
- **NÃO misturar** Glargina com outras insulinas na mesma seringa
- Aplicar em **horário fixo diário** (preferencialmente ao deitar)
- Rodízio obrigatório dos locais de aplicação (abdômen, coxas, braços)
- Armazenar: geladeira 2–8°C (lacrado); temperatura ambiente < 30°C por até **28 dias** após aberto

---

## 6. Ferramentas e Calculadoras Clínicas com Ajuste Posológico

O FarmaUSF possui uma suíte completa de calculadoras clínicas parametrizadas pelas diretrizes internacionais e nacionais, com histórico dinâmico de cálculos e exportação imediata para a consulta SOAP.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   SUÍTE DE CALCULADORAS CLÍNICAS                       │
├──────────────────────────┬─────────────────────────┬───────────────────┤
│    Função Renal e        │   Risco Cardiovascular  │   Antropometria   │
│    Ajuste de Dose        │   e Hemorrágico         │   e Respiratório  │
├──────────────────────────┼─────────────────────────┼───────────────────┤
│ • ClCr Cockcroft-Gault   │ • HAS-BLED              │ • IMC & Classif.  │
│ • CKD-EPI 2021           │ • CHA₂DS₂-VASc          │ • Peso Ideal/Ajust│
│ • Painel RENAME Renal    │ • Equivalência Estatina │ • BSA (Mosteller) │
│ • Desprescrição Beers    │ • Equiv. Corticoides    │ • ACT & PFE Asma  │
└──────────────────────────┴─────────────────────────┴───────────────────┘
```

### Clearance de Creatinina (Cockcroft-Gault) & Painel de Ajuste Renal
- **Fórmula**:
  $$\text{ClCr (mL/min)} = \frac{(140 - \text{idade}) \times \text{peso (kg)}}{72 \times \text{Creatinina Sérica (mg/dL)}} \quad [\times 0{,}85 \text{ se feminino}]$$
- **Classificação**: Determina o estágio da DRC de G1 a G5.
- **Painel de Ajuste da RENAME**: Exibe alertas de corte de dose para antibióticos, hipoglicemiantes orais e anti-hipertensivos.

### Filtração Glomerular Estimada (CKD-EPI 2021)
- Utiliza a equação atualizada sem coeficiente racial para estimar a taxa de filtração glomerular ($mL/min/1{,}73m^2$), permitindo comparativo direto com a fórmula de Cockcroft-Gault.

### Risco de Sangramento (Escore HAS-BLED)
- Pontuação de 0 a 9 para pacientes com fibrilação atrial em uso de anticoagulantes (Varfarina / DOACs):
  - Hipertensão não controlada (+1)
  - Função renal ou hepática alterada (+1 cada)
  - Antecedente de AVC (+1)
  - Histórico de sangramento (+1)
  - Labile INR (+1)
  - Idade $> 65$ anos (+1)
  - Drogas que aumentam sangramento (AINE/antiagregante) ou Álcool (+1 cada)
- **Interpretação**: $\ge 3$ pontos indica **Alto Risco de Sangramento**, demandando monitoramento intensivo e correção de fatores de risco modificáveis.

### Risco Tromboembólico em Fibrilação Atrial (CHA₂DS₂-VASc)
- Estratifica o risco de acidente vascular cerebral isquêmico (AVC) e embolia sistêmica:
  - Insuficiência Cardíaca (+1), Hipertensão (+1), Idade $\ge 75$ (+2), Diabetes (+1), AVC/AIT prévio (+2), Doença Vascular (+1), Idade 65–74 (+1), Sexo Feminino (+1).
- **Conduta**: Escore $\ge 2$ em homens ou $\ge 3$ em mulheres indica necessidade formal de anticoagulação oral plena.

### Antropometria Clínica: IMC, Peso Ideal & Peso Ajustado
- **Índice de Massa Corporal (IMC)**: $\text{Peso (kg)} / \text{Altura (m)}^2$.
- **Peso Ideal (Devine / Robinson)**: Fundamental para ajuste de fármacos hidrofílicos em pacientes obesos:
  $$\text{PI Masculino} = 50 + 2{,}3 \times (\text{Altura em pol} - 60)$$
  $$\text{PI Feminino} = 45{,}5 + 2{,}3 \times (\text{Altura em pol} - 60)$$
- **Peso Ajustado para Obesidade**: $\text{PAjust} = \text{PI} + 0{,}4 \times (\text{Peso Real} - \text{PI})$.

### Superfície Corporal (BSA - Mosteller) & Dosagem Total
- **Fórmula de Mosteller**: $\text{BSA (m}^2) = \sqrt{\frac{\text{Peso (kg)} \times \text{Altura (cm)}}{3600}}$.
- Permite calcular a dosagem total diária recomendada com base na dose prescrita por metro quadrado ($mg/m^2$).

### Teste de Controle da Asma (ACT) & Pico de Fluxo Expiratório (PFE)
- **Escore ACT (5 perguntas de 1 a 5 pontos)**:
  - $25$ pontos: Asma Totalmente Controlada;
  - $20-24$ pontos: Asma Bem Controlada;
  - $< 20$ pontos: Asma Não Controlada.
- **Calculadora de PFE Previsto**: Calcula o fluxo de pico esperado pela equação de Knudson/Leiner em função da idade, sexo e altura do paciente, gerando as faixas do semáforo da asma:
  - Verde ($\ge 80\%$ do previsto): Zona de Segurança;
  - Amarelo ($50-79\%$ do previsto): Zona de Alerta / Iniciar Resgate;
  - Vermelho ($< 50\%$ do previsto): Zona de Perigo / Emergência Médica.

### Equivalência de Corticoides & Equivalência de Estatinas
- **Corticoides**: Permite converter doses equivalentes entre Hidrocortisona, Prednisona, Prednisolona, Metilprednisolona, Dexametasona e Betametasona.
- **Estatinas**: Conversão entre Sinvastatina, Atorvastatina e Rosuvastatina com indicação da potência de redução percentual de LDL.

### Calculadora Pediátrica & Reconstituição de Suspensões
- Cálculo exato em $mL$ por dose para formulações pediátricas comuns no SUS (Amoxicilina $250mg/5mL$, Paracetamol $200mg/mL$, Dipirona $500mg/mL$, Ibuprofeno $50mg/mL$ e $100mg/mL$) a partir do peso em $kg$ da criança.
- Tabela com o volume de água purificada e prazo de validade pós-reconstituição sob refrigeração.

### Algoritmo de Desprescrição Clínica (Beers AGS 2023 & STOPP/START)
- Guia passo a passo para identificação de prescrição em cascata, medicamentos sem indicação clínica ativa e plano de desmame gradual (*tapering*) com monitoramento de sintomas de rebote.

### Histórico e Envio Direto de Resultados para o SOAP
- Cada cálculo realizado gera um registro no painel lateral de histórico da sessão.
- Um botão dedicado **"Enviar para SOAP"** insere o texto formatado do cálculo diretamente no campo [O] Objetivo da consulta clínica em andamento.

---

## 7. Centro de Informação sobre Medicamentos (CIM) & Interações

O módulo CIM serve como compêndio técnico de consulta rápida para o farmacêutico e profissionais da USF.

### Consulta Rápida RENAME / REMUME com Filtros Dinâmicos
- Base de dados estruturada com mais de 100 medicamentos essenciais da Atenção Básica.
- **Busca Multifatorial**: Por Nome Genérico (DCB), Classe Terapêutica ou Sintoma/Indicação.
- **Ficha Técnica Detalhada**:
  - Apresentações disponíveis no SUS;
  - Posologia Usual em Adultos e Pediatria;
  - Uso na Gestação (Classificação de Risco FDA: A, B, C, D, X) e Lactação;
  - Cuidados na Administração e Armazenamento (sensibilidade à luz/calor);
  - Efeitos Adversos Mais Frequentes e Contraindicações Absolutas.

### Matriz de Compatibilidade e Interações Farmacológicas
- Mecanismo de cruzamento entre fármacos selecionados.
- Alerta visual diferenciando:
  - *Interação Leve*: Requer apenas monitoramento de rotina.
  - *Interação Moderada*: Pode requerer espaçamento de horários ou ajuste de dose.
  - *Interação Grave*: Potencialmente danosa ou contraindicada (ex: Varfarina + AINEs; Fluconazol + Sinvastatina em dose alta).

---

## 8. Educação em Saúde, Fitoterapia e Práticas Comunitárias

A aba **Educação** fornece materiais gráficos para oficinas comunitárias, ações da Farmácia Viva e intervenções de promoção da saúde.

### Guia Interativo de Fitoterapia e Plantas Medicinais do SUS
- Baseado no **Memento Fitoterápico da ANVISA** e na Política Nacional de Plantas Medicinais e Fitoterápicos do SUS.
- **Plantas Mapeadas**: *Espinheira-Santa*, *Guaco*, *Passiflora/Maracujá*, *Carqueja*, *Quebra-Pedra*, *Camomila*, *Hortelã-Pimenta*, *Alecrim-Pimenta*, *Gengibre*, *Babosa (Aloe)*, *Capim-Santo*, *Erva-Cidreira*.
- **Informações Padronizadas**: Nome Científico, Parte Utilizada, Método de Preparo correto (Infusão vs Decocção vs Maceração), Posologia e **Alertas Graves de Interações com Fármacos Alopáticos** (ex: Guaco e anticoagulantes; Carqueja e hipoglicemiantes).

### Checklist e Auditoria de Armazenamento Domiciliar (Escore de Segurança)
- Ferramenta de triagem sanitária residencial utilizada em Visitas Domiciliares ou no balcão da farmácia:
  - Medicamentos mantidos na embalagem original?
  - Ausência de medicamentos no banheiro (umidade) e na cozinha (calor)?
  - Medicamentos fora do alcance de crianças e animais de estimação?
  - Ausência de remédios com prazo de validade expirado na residência?
  - Frascos de medicamentos líquidos identificados com a data de abertura?
- **Cálculo do Escore de Segurança ($0-100\%$)**: Emite relatório de conformidade e orientações corretivas imediatas.

### Manejo de Dispositivos Inalatórios & Plano de Ação Escrito para Asma
- **Guia Visual de Técnica Inalatória**:
  - Aerossol Dosimetrado ("Bombinha" tipo spray com e sem espaçador valvulado);
  - Inaladores de Pó Seco (Turbuhaler, Diskus, Aerolizer).
- **Mitos Comuns Desmistificados**: Esclarecimentos baseados em evidências científicas sobre o receio de que a "bombinha vicie" ou "ataque o coração".
- **Gerador de Plano de Ação Escrito para Asma**: Confecciona o documento formal em cores (Verde, Amarelo e Vermelho) com os medicamentos de controle e de crise customizados para o paciente.

### Biblioteca de Procedimentos Operacionais Padrão (POPs) da Farmácia na APS
Documentos técnicos institucionais formatados segundo as normas do CFF e Anvisa:
- **`POP-FAR-01`**: *Consulta e Acompanhamento Farmacoterapêutico (Método SOAP)*.
- **`POP-FAR-02`**: *Execução e Rastreabilidade de Testes Rápidos Point-of-Care (RDC nº 786/2023)*.
- **`POP-FAR-03`**: *Visita Domiciliar Farmacêutica (VDF) e Descarte Consciente*.
- **`POP-FAR-04`**: *Cadeia de Frio, Armazenamento e Dispensação de Insulinas e Termolábeis*.
- **`POP-FAR-05`** *(Nov/2026)*: *Gerenciamento de Resíduos de Serviços de Saúde (GRSS) — RDC Anvisa nº 222/2018*.
- **`POP-FAR-06`** *(Nov/2026)*: *Avaliação do Pé Diabético e Prevenção de Amputações — IWGDF / SBD 2024*.

### Guia do Calendário Nacional de Vacinação (PNI / SUS)
- Guia interativo organizado por ciclos de vida:
  - **Criança (0 a 10 anos)**: BCG, Hepatite B, Pentavalente, VIP, Pneumocócica 10V, Rotavírus, Meningo C/ACWY, SCR.
  - **Adolescente (11 a 19 anos)**: HPV Quadrivalente (dose única atualizada), Meningo ACWY, dT, Hepatite B.
  - **Adulto & Idoso (20 a 60+ anos)**: dT (reforço decenal), Influenza anual, Pneumo 23V (indicações especiais), Covid-19, Febre Amarela.
  - **Gestante**: dTpa a partir da 20ª semana, Hepatite B, Influenza em qualquer trimestre.

---

## 9. Dashboard de Gestão & Espelho de Produção SUS

O módulo **Indicadores** transforma os atendimentos registrados em métricas analíticas para subsidiar o planejamento da gestão da unidade de saúde.

### Indicadores Clínicos e Farmacoepidemiológicos
- **Taxa de Polifarmácia**: Percentual de usuários atendidos em uso de 5 ou mais medicamentos.
- **Índice de Adesão Terapêutica**: Proporção de usuários classificados com Alta Adesão pela escala MMAS-4.
- **Prevalência de PRMs**: Gráfico de distribuição dos problemas identificados (Segurança vs Eficácia vs Necessidade).
- **Vigilância Renal**: Proporção de pacientes atendidos com taxa de filtração glomerular reduzida ($ClCr < 60\text{ mL/min}$).

### Espelho de Produção SUS (Conferência com e-SUS PEC e SISAB)
- Painel consolidado que contabiliza os procedimentos oficiais realizados pela farmácia na competência mensal:
  - `01.01.01.003-6` (Consultas Farmacêuticas Ambulatoriais);
  - `01.01.02.003-1` (Visitas Domiciliares Farmacêuticas);
  - `02.14.01.001-5` (Glicemias Capilares Realizadas);
  - `03.01.10.003-9` (Aferições de Pressão Arterial);
  - `02.14.01.004-0` (Testes Rápidos de Triagem).
- Permite que o farmacêutico confronte os números reais com os relatórios emitidos pelo SISAB / e-SUS PEC municipal antes do fechamento do faturamento BPA/RAAS.

### Exportação de Relatório SIGTAP (CSV)
- Exportação em um clique de arquivo em planilha CSV contendo a relação detalhada dos atendimentos, identificador anonimizado do cidadão, data, código SIGTAP, CIAP-2 e conduta executada.

---

## 10. Integração em Nuvem & Armazenamento (Supabase & Google Sheets)

O FarmaUSF opera em arquitetura híbrida com sincronização contínua e tolerância a falhas de conexão.

```
                         ┌────────────────────────┐
                         │   Navegador Web / PWA  │
                         │       (FarmaUSF)       │
                         └───────────┬────────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             ▼                       ▼                       ▼
   ┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
   │   LocalStorage    │   │  Supabase Cloud   │   │   Google Sheets   │
   │  (Modo Offline    │   │  (PostgreSQL +    │   │  (Apps Script Web │
   │   Automático)     │   │   Auth + RLS)     │   │   App Endpoint)   │
   └───────────────────┘   └───────────────────┘   └───────────────────┘
```

### Supabase Cloud (Autenticação RBAC e Banco de Dados Clínico)
- Permite persistência centralizada de usuários e registros clínicos em banco de dados relacional (PostgreSQL).
- **Ativação**: No modal de login ou pelo menu superior, clique no badge do Supabase e informe a **URL do Projeto** e a **Chave Anônima (Anon Key)**.
- O sistema sincroniza as tabelas `profiles` (dados cadastrais do profissional) e `consultas_soap` (registros clínicos estruturados).

### Exportação de Indicadores para Google Sheets (Apps Script)
- Permite que a equipe eSF/eMulti alimente painéis em planilhas compartilhadas sem a necessidade de digitação manual de formulários.
- **Configuração**:
  1. No Passo 5 da consulta SOAP, clique em *"Exportar para Google Sheets"*;
  2. Insira a URL do Web App gerada pela implantação do script no Google Apps Script;
  3. Ao salvar qualquer atendimento, o payload JSON é transmitido via requisição HTTP assíncrona, preenchendo automaticamente as colunas da planilha da unidade.

### Operação Híbrida e Resiliência Offline (LocalStorage)
- Se a unidade de saúde estiver sem acesso à internet no momento do atendimento, o sistema armazena todos os registros no armazenamento local do navegador (`localStorage`).
- Nenhum dado é perdido durante quedas de conexão ou visitas domiciliares na zona rural e periferia sem sinal 4G/Wi-Fi.

---

## 11. Boas Práticas, Ética Farmacêutica e Fluxo na USF

1. **Acolhimento com Escuta Qualificada**: Inicie a consulta com empatia, esclarecendo que a consulta farmacêutica não substitui o atendimento médico ou de enfermagem, mas soma forças para garantir a segurança dos medicamentos.
2. **Checagem Ativa da Sacola de Remédios ("Brown Bag Test")**: Oriente o paciente a trazer todos os frascos, caixas, pomadas, colírios, chás e suplementos que utiliza no dia a dia. A verificação visual direta previne erros graves de duplicidade posológica e frascos vencidos.
3. **Registro Fiel e Imediato no e-SUS PEC**: Mantenha o hábito de colar a evolução clínica SOAP no campo oficial de prontuário eletrônico do e-SUS PEC no mesmo dia do atendimento, assegurando que outros profissionais da equipe tenham acesso às observações farmacêuticas.
4. **Matriciamento e Conduta Não Punitiva**: Ao identificar erros de prescrição ou duplicidades, utilize o documento formal de *Parecer Técnico* ou discuta o caso na reunião de matriciamento da equipe de forma colaborativa e fundamentada na literatura técnica.
5. **Autonomia e Empoderamento do Cidadão**: Sempre que entregar o *Plano Posológico Visual*, certifique-se de que o paciente ou seu cuidador entendeu perfeitamente a relação entre os desenhos (Sol, Tarde, Lua) e as tomadas dos comprimidos.

---

*FarmaUSF v.2.1.0 — Desenvolvido para qualificar a Farmácia Clínica e o Cuidado Farmacêutico na Atenção Primária à Saúde.*

---

## 📋 Registro de Atualizações

| Versão | Data | Descrição |
| :--- | :--- | :--- |
| **v.2.0.0** | Out/2026 | Adição de 2 novos testes rápidos (Hepatite C/Anti-HCV e Chikungunya/Zika IgM/IgG); novo `POP-FAR-05` de Gerenciamento de Resíduos (RDC Anvisa 222/2018); atualização das opções de leitura qualitativa dos testes de arbovirose. |
| **v.2.1.0** | Nov/2026 | Adição do protocolo e fluxograma de **Avaliação do Pé Diabético** (IWGDF/SBD 2024) com estratificação de risco em 4 níveis; novo **`POP-FAR-06`** (Avaliação do Pé Diabético); protocolo e fluxograma de **Transição NPH → Glargina U-100** com algoritmo TREAT-TO-TARGET; Insulina Glargina adicionada ao banco de medicamentos (CIM); 2 novos protocolos clínicos cadastrados (`pe_diabetico` e `transicao_nph_glargina`). |
| v.1.0.0 | Set/2026 | Lançamento inicial da plataforma. |
