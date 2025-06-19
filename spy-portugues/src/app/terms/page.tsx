import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Termos de Serviço</h1>
          <p className="text-muted-foreground mt-2">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Aceitação dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ao aceder e utilizar a plataforma SpyPortuguês, você aceita estar vinculado a estes 
              Termos de Serviço e à nossa Política de Privacidade. Se não concordar com qualquer 
              parte destes termos, não deve utilizar os nossos serviços.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Descrição do Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O SpyPortuguês é uma plataforma de análise de concorrentes no setor imobiliário português. 
              Fornecemos serviços de monitorização de anúncios, análise de preços, alertas de mercado, 
              e relatórios de inteligência competitiva para profissionais do setor imobiliário.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Registo de Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para utilizar nossos serviços, deve criar uma conta fornecendo informações precisas e completas:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Deve ter pelo menos 18 anos de idade</li>
              <li>Deve fornecer informações verdadeiras e atualizadas</li>
              <li>É responsável pela segurança da sua conta e palavra-passe</li>
              <li>Deve notificar-nos imediatamente de qualquer uso não autorizado</li>
              <li>Uma pessoa ou entidade pode manter apenas uma conta ativa</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Uso Aceitável</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao usar nossa plataforma, você concorda em:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Usar os serviços apenas para fins legais e éticos</li>
              <li>Não interferir com o funcionamento da plataforma</li>
              <li>Não tentar aceder a áreas restritas ou contas de outros utilizadores</li>
              <li>Não usar os dados para fins de spam ou atividades maliciosas</li>
              <li>Respeitar os direitos de propriedade intelectual</li>
              <li>Não revender ou redistribuir os dados sem autorização</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Propriedade Intelectual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Todos os conteúdos, funcionalidades, e elementos da plataforma SpyPortuguês, incluindo 
              mas não limitado a textos, gráficos, logos, ícones, imagens, e software, são propriedade 
              da SpyPortuguês ou dos seus licenciadores e estão protegidos por leis de direitos autorais 
              e outras leis de propriedade intelectual.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Privacidade e Proteção de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O tratamento dos seus dados pessoais é regido pela nossa Política de Privacidade, 
              que está em conformidade com o Regulamento Geral sobre a Proteção de Dados (RGPD). 
              Ao usar nossos serviços, você consente com a coleta e uso de informações de acordo 
              com nossa Política de Privacidade.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitação de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Na máxima extensão permitida por lei:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Os serviços são fornecidos "como estão" sem garantias</li>
              <li>Não garantimos a precisão, completude ou atualidade dos dados</li>
              <li>Não somos responsáveis por decisões tomadas com base nos nossos dados</li>
              <li>A nossa responsabilidade é limitada ao valor pago pelos serviços</li>
              <li>Não somos responsáveis por danos indiretos ou consequenciais</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Subscrições e Pagamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Ao subscrever nossos serviços pagos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Os pagamentos são processados através de provedores seguros</li>
              <li>As subscrições são renovadas automaticamente salvo indicação contrária</li>
              <li>Pode cancelar a subscrição a qualquer momento</li>
              <li>Reembolsos são processados de acordo com nossa política de reembolso</li>
              <li>Os preços podem ser alterados com aviso prévio de 30 dias</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Suspensão e Terminação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Reservamo-nos o direito de suspender ou terminar sua conta a qualquer momento, 
              com ou sem aviso prévio, se violar estes termos ou por qualquer outra razão que 
              consideremos apropriada. Você pode terminar sua conta a qualquer momento através 
              das configurações da conta ou contactando-nos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Alterações aos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Podemos modificar estes termos a qualquer momento. Alterações significativas serão 
              notificadas através da plataforma ou por email. O uso continuado dos serviços após 
              as alterações constitui aceitação dos novos termos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Lei Aplicável</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Estes termos são regidos pelas leis de Portugal. Qualquer disputa será resolvida 
              nos tribunais competentes de Portugal. Se alguma disposição destes termos for 
              considerada inválida, as restantes disposições permanecerão em vigor.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Para questões sobre estes termos de serviço, contacte-nos:
            </p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p><strong>Email:</strong> legal@spyportugues.com</p>
              <p><strong>Morada:</strong> [Endereço da empresa]</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
