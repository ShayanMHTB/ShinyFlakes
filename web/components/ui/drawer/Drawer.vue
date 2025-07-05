<script lang="ts" setup>
import { defineProps, defineEmits, computed } from 'vue';
import { DrawerRoot } from 'vaul-vue';
import { useForwardPropsEmits } from 'reka-ui';
import type { DrawerRootEmits, DrawerRootProps } from 'vaul-vue';

const props = withDefaults(defineProps<DrawerRootProps>(), {
  shouldScaleBackground: true,
});

const emits = defineEmits<DrawerRootEmits>();

const forwarded = useForwardPropsEmits(props, emits);
const forwardedObject = computed(() => {
  return forwarded.value as Record<string, unknown>;
});
</script>

<template>
  <DrawerRoot data-slot="drawer" v-bind="forwardedObject">
    <slot />
  </DrawerRoot>
</template>
