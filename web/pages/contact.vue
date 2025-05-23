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
                Contact Us
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-muted-foreground">
              We're here to help with all your needs
            </p>
          </div>

          <div class="max-w-3xl mx-auto">
            <p class="text-lg text-muted-foreground leading-relaxed">
              Whether you need support, want to become a vendor, or just have
              questions about our products, we're always ready to help.
              Remember: we're the ones who knock!
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Options Grid -->
    <section class="py-24">
      <div class="container px-4 mx-auto">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <!-- Customer Support -->
            <Card
              class="text-center p-6 hover:shadow-lg transition-shadow group"
            >
              <CardContent class="space-y-4">
                <div
                  class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors"
                >
                  <Icon name="lucide:headphones" class="h-8 w-8 text-primary" />
                </div>
                <h3 class="text-xl font-semibold">Customer Support</h3>
                <p class="text-muted-foreground">
                  Need help with an order or have questions about our products?
                </p>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-center space-x-2">
                    <Icon name="lucide:clock" class="h-4 w-4" />
                    <span>24/7 Support Available</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <Icon name="lucide:zap" class="h-4 w-4" />
                    <span>Average Response: 2 hours</span>
                  </div>
                </div>
                <Button class="w-full" @click="openSupportForm">
                  <Icon name="lucide:message-circle" class="mr-2 h-4 w-4" />
                  Get Support
                </Button>
              </CardContent>
            </Card>

            <!-- Vendor Registration -->
            <Card
              class="text-center p-6 hover:shadow-lg transition-shadow group"
            >
              <CardContent class="space-y-4">
                <div
                  class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors"
                >
                  <Icon name="lucide:handshake" class="h-8 w-8 text-primary" />
                </div>
                <h3 class="text-xl font-semibold">Become a Vendor</h3>
                <p class="text-muted-foreground">
                  Join our marketplace and start selling your high-quality
                  products.
                </p>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-center space-x-2">
                    <Icon name="lucide:trending-up" class="h-4 w-4" />
                    <span>Grow Your Business</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <Icon name="lucide:shield-check" class="h-4 w-4" />
                    <span>Verified Partners Only</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  class="w-full"
                  @click="openVendorForm"
                >
                  <Icon name="lucide:store" class="mr-2 h-4 w-4" />
                  Apply to Sell
                </Button>
              </CardContent>
            </Card>

            <!-- General Inquiries -->
            <Card
              class="text-center p-6 hover:shadow-lg transition-shadow group"
            >
              <CardContent class="space-y-4">
                <div
                  class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors"
                >
                  <Icon name="lucide:mail" class="h-8 w-8 text-primary" />
                </div>
                <h3 class="text-xl font-semibold">General Inquiries</h3>
                <p class="text-muted-foreground">
                  Questions about partnerships, media, or other business
                  matters?
                </p>
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-center space-x-2">
                    <Icon name="lucide:building" class="h-4 w-4" />
                    <span>Business Partnerships</span>
                  </div>
                  <div class="flex items-center justify-center space-x-2">
                    <Icon name="lucide:camera" class="h-4 w-4" />
                    <span>Media Inquiries</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  class="w-full"
                  @click="openGeneralForm"
                >
                  <Icon name="lucide:send" class="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="py-24 bg-muted/30" v-show="showContactForm">
      <div class="container px-4 mx-auto">
        <div class="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-2xl">{{ formTitle }}</CardTitle>
                  <CardDescription>{{ formDescription }}</CardDescription>
                </div>
                <Button variant="ghost" size="icon" @click="closeForm">
                  <Icon name="lucide:x" class="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form @submit.prevent="submitForm" class="space-y-6">
                <!-- Contact Type Selection -->
                <div class="space-y-2">
                  <Label>Contact Type</Label>
                  <Select v-model="form.type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Customer Support</SelectItem>
                      <SelectItem value="vendor">Vendor Application</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="partnership"
                        >Business Partnership</SelectItem
                      >
                      <SelectItem value="media">Media Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Name -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <Label for="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      v-model="form.firstName"
                      placeholder="Walter"
                      required
                    />
                  </div>
                  <div class="space-y-2">
                    <Label for="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      v-model="form.lastName"
                      placeholder="White"
                      required
                    />
                  </div>
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <Label for="email">Email Address</Label>
                  <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="heisenberg@example.com"
                    required
                  />
                </div>

                <!-- Company (for vendors/partnerships) -->
                <div
                  v-if="form.type === 'vendor' || form.type === 'partnership'"
                  class="space-y-2"
                >
                  <Label for="company">Company Name</Label>
                  <Input
                    id="company"
                    v-model="form.company"
                    placeholder="Gray Matter Technologies"
                  />
                </div>

                <!-- Order Number (for support) -->
                <div v-if="form.type === 'support'" class="space-y-2">
                  <Label for="orderNumber">Order Number (Optional)</Label>
                  <Input
                    id="orderNumber"
                    v-model="form.orderNumber"
                    placeholder="#SF-123456"
                  />
                </div>

                <!-- Priority (for support) -->
                <div v-if="form.type === 'support'" class="space-y-2">
                  <Label>Priority Level</Label>
                  <Select v-model="form.priority">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low"
                        >Low - General Question</SelectItem
                      >
                      <SelectItem value="medium"
                        >Medium - Order Issue</SelectItem
                      >
                      <SelectItem value="high"
                        >High - Urgent Problem</SelectItem
                      >
                    </SelectContent>
                  </Select>
                </div>

                <!-- Subject -->
                <div class="space-y-2">
                  <Label for="subject">Subject</Label>
                  <Input
                    id="subject"
                    v-model="form.subject"
                    placeholder="How can we help you today?"
                    required
                  />
                </div>

                <!-- Message -->
                <div class="space-y-2">
                  <Label for="message">Message</Label>
                  <Textarea
                    id="message"
                    v-model="form.message"
                    placeholder="Tell us more about your inquiry..."
                    rows="6"
                    required
                  />
                </div>

                <!-- Terms Agreement (for vendors) -->
                <div v-if="form.type === 'vendor'" class="space-y-2">
                  <div class="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      v-model:checked="form.agreedToTerms"
                      required
                    />
                    <Label for="terms" class="text-sm leading-relaxed">
                      I agree to the vendor terms and conditions and understand
                      that all applications are subject to review and approval.
                    </Label>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex gap-4">
                  <Button type="submit" :disabled="isSubmitting" class="flex-1">
                    <Icon
                      v-if="isSubmitting"
                      name="lucide:loader-2"
                      class="mr-2 h-4 w-4 animate-spin"
                    />
                    <Icon v-else name="lucide:send" class="mr-2 h-4 w-4" />
                    {{ isSubmitting ? 'Sending...' : 'Send Message' }}
                  </Button>
                  <Button type="button" variant="outline" @click="closeForm">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- Quick Contact Info -->
    <section class="py-24">
      <div class="container px-4 mx-auto">
        <div class="max-w-4xl mx-auto">
          <div class="text-center space-y-4 mb-12">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
              Other Ways to Reach Us
            </h2>
            <p class="text-xl text-muted-foreground">
              Multiple channels for your convenience
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Emergency Contact -->
            <Card class="p-6">
              <CardContent class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center"
                  >
                    <Icon name="lucide:phone" class="h-5 w-5 text-red-500" />
                  </div>
                  <h3 class="text-lg font-semibold">Emergency Support</h3>
                </div>
                <p class="text-muted-foreground">
                  For urgent issues that need immediate attention, call our
                  emergency line. Available 24/7 for critical problems.
                </p>
                <Button variant="outline" class="w-full">
                  <Icon name="lucide:phone" class="mr-2 h-4 w-4" />
                  1-800-SHINY-FL
                </Button>
              </CardContent>
            </Card>

            <!-- Live Chat -->
            <Card class="p-6">
              <CardContent class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center"
                  >
                    <Icon
                      name="lucide:message-circle"
                      class="h-5 w-5 text-green-500"
                    />
                  </div>
                  <h3 class="text-lg font-semibold">Live Chat</h3>
                </div>
                <p class="text-muted-foreground">
                  Chat with our support team in real-time. Perfect for quick
                  questions and immediate assistance.
                </p>
                <div
                  class="flex items-center space-x-2 text-sm text-muted-foreground"
                >
                  <Icon name="lucide:clock" class="h-4 w-4" />
                  <span>Usually responds in under 5 minutes</span>
                </div>
                <Button variant="outline" class="w-full">
                  <Icon name="lucide:message-circle" class="mr-2 h-4 w-4" />
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-24 bg-muted/30">
      <div class="container px-4 mx-auto">
        <div class="max-w-4xl mx-auto">
          <div class="text-center space-y-4 mb-12">
            <h2 class="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p class="text-xl text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div class="space-y-4">
            <Collapsible v-for="faq in faqs" :key="faq.id" class="space-y-2">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  class="flex w-full justify-between p-4 text-left font-medium hover:bg-background"
                >
                  <span>{{ faq.question }}</span>
                  <Icon
                    name="lucide:chevron-down"
                    class="h-4 w-4 transition-transform duration-200"
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent class="px-4 pb-4 text-muted-foreground">
                {{ faq.answer }}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Alert -->
    <Alert
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 max-w-md z-50 border-green-500 bg-green-50 dark:bg-green-950"
    >
      <Icon name="lucide:check-circle" class="h-4 w-4 text-green-600" />
      <AlertTitle class="text-green-800 dark:text-green-200"
        >Message Sent!</AlertTitle
      >
      <AlertDescription class="text-green-700 dark:text-green-300">
        Thanks for reaching out! We'll get back to you within 24 hours.
      </AlertDescription>
    </Alert>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Page meta
definePageMeta({
  layout: 'default',
});

// SEO
useSeoMeta({
  title: 'Contact Us | ShinyFlakes',
  description:
    "Get in touch with ShinyFlakes for support, vendor inquiries, or general questions. We're here to help!",
});

// Reactive state
const showContactForm = ref(false);
const isSubmitting = ref(false);
const showSuccessMessage = ref(false);
const formTitle = ref('');
const formDescription = ref('');

const form = reactive({
  type: '',
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  orderNumber: '',
  priority: '',
  subject: '',
  message: '',
  agreedToTerms: false,
});

// FAQ data
const faqs = ref([
  {
    id: 1,
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for all unused items in original packaging. For consumable products, returns are accepted within 7 days of delivery if the item is defective.',
  },
  {
    id: 2,
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 3-5 business days. Express shipping (1-2 days) and overnight shipping options are available. We ship Monday through Friday.',
  },
  {
    id: 3,
    question: 'Are your products really 99.1% pure?',
    answer:
      "Absolutely! We maintain the highest quality standards, just like our inspiration. All products undergo rigorous testing and quality control. We don't compromise on purity.",
  },
  {
    id: 4,
    question: 'How can I become a vendor?',
    answer:
      'Fill out our vendor application form above. We review all applications carefully and look for partners who share our commitment to quality and customer service.',
  },
  {
    id: 5,
    question: 'Do you offer bulk discounts?',
    answer:
      'Yes! We offer volume discounts for orders over $500. Contact our sales team for custom pricing on large orders.',
  },
  {
    id: 6,
    question: 'Is this website actually selling drugs?',
    answer:
      "No! ShinyFlakes is a completely legitimate parody e-commerce site inspired by the TV show 'How to Sell Drugs Online (Fast)'. We sell legal products and this is purely for educational/entertainment purposes.",
  },
]);

// Methods
const openSupportForm = () => {
  form.type = 'support';
  formTitle.value = 'Customer Support';
  formDescription.value = 'Tell us how we can help resolve your issue';
  showContactForm.value = true;
};

const openVendorForm = () => {
  form.type = 'vendor';
  formTitle.value = 'Vendor Application';
  formDescription.value = 'Apply to become a ShinyFlakes vendor partner';
  showContactForm.value = true;
};

const openGeneralForm = () => {
  form.type = 'general';
  formTitle.value = 'General Inquiry';
  formDescription.value = 'Send us your questions or feedback';
  showContactForm.value = true;
};

const closeForm = () => {
  showContactForm.value = false;
  resetForm();
};

const resetForm = () => {
  Object.keys(form).forEach((key) => {
    if (typeof form[key] === 'boolean') {
      form[key] = false;
    } else {
      form[key] = '';
    }
  });
};

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Show success message
    showSuccessMessage.value = true;
    closeForm();

    // Hide success message after 5 seconds
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 5000);

    console.log('Form submitted:', form);
  } catch (error) {
    console.error('Failed to submit form:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
