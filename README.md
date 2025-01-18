# Iluminação-PV

O projeto **Iluminação-PV** é uma interface web desenvolvida para integrar e gerenciar o sistema de iluminação da Palavra Viva Church, utilizando a plataforma **SmartLife Tuya**. Este sistema permite o controle inteligente e centralizado das luzes em diversos ambientes da igreja, como a **Nave**, o **Kids** e as **Salas**.  

## Objetivos do Projeto

- **Automatização**: Facilitar o controle da iluminação por meio de uma interface simples e acessível.  
- **Eficiência Energética**: Gerenciar o uso das luzes de forma otimizada, reduzindo desperdícios.  
- **Conveniência**: Oferecer controle remoto para diferentes ambientes, adaptando a iluminação às necessidades específicas de cada espaço.  
- **Integração**: Utilizar o ecossistema Tuya para aproveitar funcionalidades modernas de IoT (Internet das Coisas).  

## Funcionalidades Principais

1. **Controle Centralizado**:  
   - Interface web para gerenciar as luzes de todos os ambientes da igreja.  
   - Possibilidade de ligar, desligar e ajustar a intensidade das luzes.  

2. **Gestão por Ambiente**:  
   - **Nave**: Configuração de cenas específicas para cultos, eventos e ensaios.  
   - **Kids**: Controle adaptado para criar um ambiente acolhedor e seguro para as crianças.  
   - **Salas**: Ajustes personalizados para reuniões, pequenos grupos e treinamentos.  

3. **Cenários Personalizados**:  
   - Predefinição de cenas de iluminação para diferentes momentos, como cultos, conferências ou períodos de limpeza.  

4. **Acesso Remoto**:  
   - Controle das luzes de qualquer lugar com acesso à internet.  
   - Suporte a múltiplos usuários com diferentes níveis de permissão.  

5. **Integração com Tuya**:  
   - Sincronização com dispositivos Tuya SmartLife para garantir confiabilidade e escalabilidade.  

## Benefícios

- **Praticidade**: Controle total da iluminação por meio de uma interface amigável.  
- **Adaptação Rápida**: Mudança instantânea de configurações para diferentes eventos e ambientes.  
- **Economia**: Redução de custos com energia ao otimizar o uso das luzes.  
- **Modernidade**: Implementação de tecnologia IoT para uma igreja conectada e eficiente.  

O **Iluminação-PV** é uma solução que reflete o compromisso da Palavra Viva Church com a inovação e a excelência em seus espaços, criando ambientes que atendem às necessidades da comunidade com eficiência e praticidade.  

Segue a tradução da descrição:

# smart-life-webapp

Aplicativo web simples hospedado no [Vercel](https://vercel.com/) para controlar dispositivos e cenas do [Smart Life](https://www.ismartlife.me/).

> [!IMPORTANTE]  
> É necessário adicionar o sufixo `#` aos nomes das suas `automatizações`, caso contrário, elas serão exibidas como `cenas`.  
> Isso é necessário devido a uma limitação da API Tuya.  

## Website  
[Iluminacao](https://iluminacao.palavravivachurch.org)

* Apenas contas do SmartLife criadas com e-mail e senha são suportadas.  
  * Contas vinculadas ao Google não funcionam, por razões desconhecidas.  

## Configuração do Projeto
```
npm install
```

### Compilar e executar com recarregamento automático para desenvolvimento
```
npm run serve
```

### Compilar e minificar para produção
```
npm run build
```

### Notas
* **API Tuya** https://www.home-assistant.io/integrations/tuya/  

