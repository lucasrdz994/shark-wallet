<script setup>
import { reactive, computed, watchEffect } from 'vue'

// Props
const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

// References
const balance = reactive({
  income: 0,
  expense: 0,
  pending: 0
})

// Computed
const totalBalance = computed(() => balance.income - balance.expense)
const negativeBalance = computed(() => totalBalance.value < 0)

watchEffect(() => {
  balance.income = 0
  balance.expense = 0
  balance.pending = 0
  for (const item of props.items) {
    balance[item.type] += item.amount
  }
})
</script>

<template>
  <section class="balance">
    <span>
      $ {{ totalBalance }}
      <van-icon v-if="negativeBalance" class="status-icon" size="28" name="fire-o" color="#ee0a24" />
      <van-icon v-else class="status-icon" size="28" name="good-job-o" color="#1989fa" />
    </span>
    <span v-if="balance.pending < 0" class="pending">- $ {{ balance.pending }}</span>
  </section>
</template>

<style scoped>
.balance {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--van-padding-md) 0;
  font-weight: 600;
  font-size: 52px;
  color: var(--app-dark);
}
.status-icon {
  padding: 0.5rem;
  background-color: var(--app-white);
  border-radius: 50%;
}
.pending {
  color: var(--app-danger);
  font-weight: 600;
  align-self: flex-end;
  font-size: 16px;
}
</style>
