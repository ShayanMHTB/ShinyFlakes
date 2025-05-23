<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden bg-gradient-to-br from-background via-muted/50 to-background"
    >
      <div class="container px-4 py-24 mx-auto">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div class="space-y-4">
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight">
              <span
                class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
              >
                About ShinyFlakes
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-muted-foreground">
              The story behind the empire
            </p>
          </div>

          <div class="max-w-3xl mx-auto">
            <p class="text-lg text-muted-foreground leading-relaxed">
              What started as a small operation has grown into something much
              bigger. We're not just selling products; we're building an empire
              of quality, precision, and customer satisfaction that would make
              even Heisenberg proud.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Origin Story Section -->
    <section class="py-24 bg-muted/30">
      <div class="container px-4 mx-auto">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
              <Badge variant="outline" class="w-fit">
                <Icon name="lucide:beaker" class="h-3 w-3 mr-1" />
                Origin Story
              </Badge>

              <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
                It All Started in a Garage
              </h2>

              <div class="space-y-4 text-muted-foreground">
                <p>
                  Just like every great tech company, ShinyFlakes began in a
                  humble garage. But instead of coding software, our founders
                  were perfecting the art of creating the highest quality
                  products with 99.1% purity.
                </p>

                <p>
                  Inspired by the legendary work ethic and attention to detail
                  of Walter White (minus the illegal activities, of course), we
                  built our business on three core principles: chemistry,
                  precision, and respect.
                </p>

                <p>
                  Today, ShinyFlakes is the premier destination for premium
                  products that sparkle with quality. We've come a long way from
                  that garage, but we've never forgotten our roots.
                </p>
              </div>

              <div class="flex items-center space-x-4">
                <Badge variant="default" class="text-sm">
                  <Icon name="lucide:award" class="h-3 w-3 mr-1" />
                  99.1% Pure Quality
                </Badge>
                <Badge variant="secondary" class="text-sm">
                  <Icon name="lucide:users" class="h-3 w-3 mr-1" />
                  10,000+ Happy Customers
                </Badge>
              </div>
            </div>

            <div class="relative">
              <Card
                class="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
              >
                <div class="text-center space-y-4">
                  <div
                    class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Icon
                      name="lucide:flask-conical"
                      class="h-8 w-8 text-primary"
                    />
                  </div>
                  <blockquote class="text-lg italic text-muted-foreground">
                    "I am not in danger, Skyler. I am the danger! A guy opens
                    his door and gets shot, and you think that of me? No! I am
                    the one who knocks!"
                  </blockquote>
                  <cite class="text-sm font-medium">
                    - Walter White, our spiritual inspiration
                  </cite>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-24">
      <div class="container px-4 mx-auto">
        <div class="max-w-6xl mx-auto">
          <div class="text-center space-y-4 mb-16">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
              Meet Our Team
            </h2>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
              The brilliant minds behind ShinyFlakes operation
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Team Member 1 -->
            <Card class="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent class="space-y-4">
                <Avatar class="w-20 h-20 mx-auto">
                  <AvatarFallback
                    class="bg-primary text-primary-foreground text-xl"
                  >
                    H
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 class="text-xl font-semibold">Walter H.</h3>
                  <p class="text-muted-foreground">Chief Executive Officer</p>
                </div>
                <p class="text-sm text-muted-foreground">
                  Former high school chemistry teacher turned entrepreneur.
                  Brings precision and attention to detail to every operation.
                </p>
                <div class="flex justify-center space-x-2">
                  <Badge variant="outline" class="text-xs"
                    >Chemistry Expert</Badge
                  >
                  <Badge variant="outline" class="text-xs">99.1% Pure</Badge>
                </div>
              </CardContent>
            </Card>

            <!-- Team Member 2 -->
            <Card class="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent class="space-y-4">
                <Avatar class="w-20 h-20 mx-auto">
                  <AvatarFallback class="bg-blue-500 text-white text-xl">
                    J
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 class="text-xl font-semibold">Jesse P.</h3>
                  <p class="text-muted-foreground">Chief Technology Officer</p>
                </div>
                <p class="text-sm text-muted-foreground">
                  Digital native who transformed our online presence. Expert in
                  e-commerce and customer engagement. Yeah, science!
                </p>
                <div class="flex justify-center space-x-2">
                  <Badge variant="outline" class="text-xs">Tech Wizard</Badge>
                  <Badge variant="outline" class="text-xs"
                    >Digital Marketing</Badge
                  >
                </div>
              </CardContent>
            </Card>

            <!-- Team Member 3 -->
            <Card class="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent class="space-y-4">
                <Avatar class="w-20 h-20 mx-auto">
                  <AvatarFallback class="bg-green-500 text-white text-xl">
                    S
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 class="text-xl font-semibold">Saul G.</h3>
                  <p class="text-muted-foreground">Legal & Business Affairs</p>
                </div>
                <p class="text-sm text-muted-foreground">
                  "Better Call Saul" for all your legal needs. Ensures all our
                  operations are completely legitimate and above board.
                </p>
                <div class="flex justify-center space-x-2">
                  <Badge variant="outline" class="text-xs">Legal Expert</Badge>
                  <Badge variant="outline" class="text-xs">Compliance</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-24 bg-muted/30">
      <div class="container px-4 mx-auto">
        <div class="max-w-6xl mx-auto">
          <div class="text-center space-y-4 mb-16">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
              Our Core Values
            </h2>
            <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Value 1 -->
            <Card class="text-center p-6 border-0 shadow-md bg-background">
              <CardContent class="space-y-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <Icon name="lucide:target" class="h-6 w-6 text-primary" />
                </div>
                <h3 class="text-xl font-semibold">Precision</h3>
                <p class="text-muted-foreground">
                  Every product is crafted with scientific precision. We don't
                  do "good enough" - we do perfect or we don't do it at all.
                </p>
              </CardContent>
            </Card>

            <!-- Value 2 -->
            <Card class="text-center p-6 border-0 shadow-md bg-background">
              <CardContent class="space-y-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <Icon name="lucide:heart" class="h-6 w-6 text-primary" />
                </div>
                <h3 class="text-xl font-semibold">Respect</h3>
                <p class="text-muted-foreground">
                  We respect our customers, our team, and our craft. Every
                  interaction is built on mutual respect and understanding.
                </p>
              </CardContent>
            </Card>

            <!-- Value 3 -->
            <Card class="text-center p-6 border-0 shadow-md bg-background">
              <CardContent class="space-y-4">
                <div
                  class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                >
                  <Icon name="lucide:zap" class="h-6 w-6 text-primary" />
                </div>
                <h3 class="text-xl font-semibold">Innovation</h3>
                <p class="text-muted-foreground">
                  We're always pushing boundaries and finding new ways to
                  improve. Science isn't static, and neither are we.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Statement -->
    <section class="py-24">
      <div class="container px-4 mx-auto">
        <div class="max-w-4xl mx-auto text-center">
          <Card
            class="p-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
          >
            <CardContent class="space-y-8">
              <div
                class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
              >
                <Icon name="lucide:rocket" class="h-8 w-8 text-primary" />
              </div>

              <div class="space-y-4">
                <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
                  Our Mission
                </h2>
                <p class="text-xl text-muted-foreground leading-relaxed">
                  To provide the highest quality products with uncompromising
                  standards, exceptional customer service, and a commitment to
                  excellence that would make even the most demanding chemistry
                  teacher proud.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <NuxtLink to="/products">
                    <Icon name="lucide:shopping-bag" class="mr-2 h-5 w-5" />
                    Shop Our Products
                  </NuxtLink>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <NuxtLink to="/contact">
                    <Icon name="lucide:mail" class="mr-2 h-5 w-5" />
                    Get In Touch
                  </NuxtLink>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Fun Facts Section -->
    <section class="py-24 bg-muted/30">
      <div class="container px-4 mx-auto">
        <div class="max-w-6xl mx-auto">
          <div class="text-center space-y-4 mb-16">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
              By the Numbers
            </h2>
            <p class="text-xl text-muted-foreground">
              Some impressive stats from our journey
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center space-y-2">
              <div class="text-4xl font-bold text-primary">99.1%</div>
              <div class="text-muted-foreground">Product Purity</div>
            </div>

            <div class="text-center space-y-2">
              <div class="text-4xl font-bold text-primary">10,000+</div>
              <div class="text-muted-foreground">Happy Customers</div>
            </div>

            <div class="text-center space-y-2">
              <div class="text-4xl font-bold text-primary">5</div>
              <div class="text-muted-foreground">Years in Business</div>
            </div>

            <div class="text-center space-y-2">
              <div class="text-4xl font-bold text-primary">24/7</div>
              <div class="text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Page meta
definePageMeta({
  layout: 'default',
});

// SEO
useSeoMeta({
  title: 'About Us | ShinyFlakes',
  description:
    'Learn about ShinyFlakes - the story behind our empire of quality, precision, and customer satisfaction.',
});
</script>
