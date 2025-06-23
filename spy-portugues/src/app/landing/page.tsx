"use client"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Layout } from "@/components/layout/layout"
import Link from "next/link"
import Image from "next/image"

// Mock hook for authentication status
const useAuth = () => {
  // Change this to true to simulate a logged-in user
  return { isAuthenticated: false }
}

export default function LandingPage() {
  const { isAuthenticated } = useAuth()

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">SpyPortuguês</h1>
          <p className="text-xl text-muted-foreground">
            Monitorização imobiliária sem esforço
          </p>
          <div className="mt-4 space-x-4">
            {isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/dashboard">Ir para o Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/sign-up">Começar Agora</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/sign-in">Entrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="https://placehold.co/600x300?text=Hero+Image"
            alt="Hero placeholder"
            width={600}
            height={300}
            className="rounded-lg shadow-md"
            priority
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Competitor Tracking</CardTitle>
              <CardDescription>
                Instantly monitor your rivals' property listings and ads across websites, Facebook, and Instagram—no manual work required.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Alerts</CardTitle>
              <CardDescription>
                Be the first to know when competitors launch new campaigns or adjust their pricing.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Actionable Insights Dashboard</CardTitle>
              <CardDescription>
                Visualize key trends and compare your performance to the competition, all in one intuitive dashboard.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data-Driven Decisions</CardTitle>
              <CardDescription>
                Use up-to-the-minute intelligence to refine your pricing, marketing, and strategy—stay one step ahead in a fast-moving market.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </Layout>
  )
}