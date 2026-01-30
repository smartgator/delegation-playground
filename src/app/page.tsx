"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  GitBranch,
  PenTool,
  Shield,
  Play,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: GitBranch,
    title: "Visual Graph",
    description: "See delegation chains visualized as interactive graphs",
  },
  {
    icon: PenTool,
    title: "Create Delegations",
    description: "Build delegations with an intuitive form interface",
  },
  {
    icon: Shield,
    title: "Explore Caveats",
    description: "Learn about the different restriction types",
  },
  {
    icon: Play,
    title: "Simulate Redemption",
    description: "Watch the validation flow step-by-step",
  },
];

const steps = [
  {
    number: "01",
    title: "Create",
    description: "Define delegator, delegate, and caveats",
  },
  {
    number: "02",
    title: "Delegate",
    description: "Grant permissions with restrictions",
  },
  {
    number: "03",
    title: "Redeem",
    description: "Execute on behalf of the delegator",
  },
];

const codeExample = `{
  "delegator": "0x1234...5678",
  "delegate": "0xabcd...efgh",
  "authority": "0x0000...root",
  "caveats": [
    {
      "enforcer": "AllowedMethodsEnforcer",
      "terms": ["transfer", "approve"]
    },
    {
      "enforcer": "TimestampEnforcer",
      "terms": { "before": 1735689600 }
    }
  ],
  "salt": "0x...",
  "signature": "0x..."
}`;

function DelegationFlowAnimation() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl opacity-50" />
      
      <svg
        viewBox="0 0 400 200"
        className="w-full h-auto relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connection lines */}
        <motion.path
          d="M80 100 L160 100"
          stroke="url(#gradient1)"
          strokeWidth="2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.path
          d="M240 100 L320 100"
          stroke="url(#gradient1)"
          strokeWidth="2"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        
        {/* Flow arrows */}
        <motion.polygon
          points="155,95 165,100 155,105"
          fill="var(--primary)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        />
        <motion.polygon
          points="315,95 325,100 315,105"
          fill="var(--primary)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        />

        {/* Delegator node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <circle
            cx="40"
            cy="100"
            r="32"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <text
            x="40"
            y="105"
            textAnchor="middle"
            className="fill-foreground text-xs font-medium"
          >
            Delegator
          </text>
        </motion.g>

        {/* Delegation node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
        >
          <rect
            x="168"
            y="68"
            width="64"
            height="64"
            rx="8"
            fill="var(--card)"
            stroke="var(--accent)"
            strokeWidth="2"
          />
          <text
            x="200"
            y="95"
            textAnchor="middle"
            className="fill-foreground text-xs font-medium"
          >
            Delegation
          </text>
          <text
            x="200"
            y="110"
            textAnchor="middle"
            className="fill-muted-foreground text-[10px]"
          >
            + Caveats
          </text>
        </motion.g>

        {/* Delegate node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
        >
          <circle
            cx="360"
            cy="100"
            r="32"
            fill="var(--card)"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <text
            x="360"
            y="105"
            textAnchor="middle"
            className="fill-foreground text-xs font-medium"
          >
            Delegate
          </text>
        </motion.g>

        {/* Floating particles */}
        <motion.circle
          cx="120"
          cy="85"
          r="3"
          fill="var(--primary)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        <motion.circle
          cx="280"
          cy="115"
          r="3"
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
        />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div 
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-6">
              MetaMask Delegation Framework
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_linear_infinite]">
                Understand Delegation Chains
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Interactive visualization tool for the MetaMask Delegation Framework.
              Create, explore, and simulate delegations without writing code.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="gap-2 px-8 h-12 text-base">
                <Link href="/playground">
                  Launch Playground
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 h-12 text-base">
                <Link href="#how-it-works">
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated illustration */}
          <motion.div
            className="mt-16 md:mt-24"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <DelegationFlowAnimation />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to explore delegations
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools designed to help you understand and work with the
              delegation framework.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to understand the delegation flow
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-transparent" />
                )}
                
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-xl mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="py-24 md:py-32 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="grid md:grid-cols-2 gap-12 items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <Badge variant="outline" className="mb-4">
                  Under the hood
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  See what a delegation looks like
                </h2>
                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                  A delegation is a signed message that grants specific permissions
                  from a delegator to a delegate, optionally with restrictions called
                  caveats.
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/playground">
                    Try it yourself
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-xl opacity-50 rounded-2xl" />
                <div className="relative rounded-xl border bg-card overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted-foreground font-mono">
                      delegation.json
                    </span>
                  </div>
                  <pre className="p-4 text-xs md:text-sm overflow-x-auto font-mono text-muted-foreground">
                    <code>{codeExample}</code>
                  </pre>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background to-muted/50">
        <motion.div
          className="container mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to explore?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Jump into the playground and start creating your first delegation chain.
          </p>
          <Button asChild size="lg" className="gap-2 px-8 h-12 text-base">
            <Link href="/playground">
              Launch Playground
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
