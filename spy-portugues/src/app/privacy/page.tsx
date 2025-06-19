import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Política de Privacidade</h1>
          <p className="text-muted-foreground mt-2">
            Última atualização: {new Date().toLocaleDateString('pt-PT')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Informações que Coletamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Informações de Conta</h4>
              <p className="text-sm text-muted-foreground">
                Coletamos informações que você fornece ao criar uma conta, incluindo nome, endereço de email, 
                e outras informações de perfil através do nosso provedor de autenticação Clerk.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Dados de Uso</h4>
              <p className="text-sm text-muted-foreground">
                Coletamos informações sobre como você usa nossa plataforma, incluindo páginas visitadas, 
                funcionalidades utilizadas, e preferências de configuração.
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Dados Técnicos</h4>
              <p className="text-sm text-muted-foreground">
                Coletamos informações técnicas como endereço IP, tipo de navegador, sistema operativo, 
                e identificadores de dispositivo para melhorar nossa plataforma.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Como Usamos Suas Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Fornecer e manter nossos serviços de análise de concorrentes imobiliários</li>
              <li>Personalizar sua experiência na plataforma</li>
              <li>Enviar notificações e alertas de preços conforme suas preferências</li>
              <li>Melhorar nossos serviços através de análise e feedback</li>
              <li>Garantir a segurança e integridade da plataforma</li>
              <li>Cumprir obrigações legais e regulamentares</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Partilha de Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Não vendemos, alugamos ou partilhamos suas informações pessoais com terceiros, 
              exceto nas seguintes circunstâncias:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Com provedores de serviços que nos ajudam a operar a plataforma (Clerk, Supabase, Vercel)</li>
              <li>Quando exigido por lei ou processo legal</li>
              <li>Para proteger nossos direitos, propriedade ou segurança</li>
              <li>Com seu consentimento explícito</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Seus Direitos (RGPD)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sob o Regulamento Geral sobre a Proteção de Dados (RGPD), você tem os seguintes direitos:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Direito de Acesso:</strong> Solicitar cópias dos seus dados pessoais</li>
              <li><strong>Direito de Retificação:</strong> Corrigir informações incorretas ou incompletas</li>
              <li><strong>Direito de Eliminação:</strong> Solicitar a eliminação dos seus dados pessoais</li>
              <li><strong>Direito de Limitação:</strong> Solicitar a limitação do processamento dos seus dados</li>
              <li><strong>Direito de Portabilidade:</strong> Receber seus dados num formato estruturado</li>
              <li><strong>Direito de Oposição:</strong> Opor-se ao processamento dos seus dados</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Para exercer qualquer destes direitos, entre em contacto connosco através de 
              <strong> privacy@spyportugues.com</strong>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Segurança dos Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger 
              seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
              Utilizamos criptografia, controlos de acesso, e monitorizamos regularmente nossos sistemas.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Retenção de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir os propósitos 
              descritos nesta política, a menos que um período de retenção maior seja exigido ou 
              permitido por lei.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Cookies e Tecnologias Similares</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar 
              o uso da plataforma, e personalizar conteúdo. Você pode controlar as configurações 
              de cookies através do seu navegador.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Alterações a Esta Política</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Podemos atualizar esta política de privacidade periodicamente. Notificaremos sobre 
              alterações significativas através da plataforma ou por email. O uso continuado 
              da plataforma após as alterações constitui aceitação da nova política.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Contacto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Se tiver questões sobre esta política de privacidade ou sobre como tratamos 
              seus dados pessoais, entre em contacto connosco:
            </p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p><strong>Email:</strong> privacy@spyportugues.com</p>
              <p><strong>Morada:</strong> [Endereço da empresa]</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
