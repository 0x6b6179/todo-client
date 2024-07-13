<script setup lang="ts">
import { watch, ref } from "vue";
import { useItemsStore } from "./stores/items";

const itemsStore = useItemsStore();

const HEADING = "Todo App";
const ADD_ITEM_LABEL = "Add New Item";
enum ITEM_ACTION_BUTTON_LABEL {
  ADD = "Add",
  COMPLETE = "Complete",
  EDIT = "Edit",
  REMOVE = "Remove",
  RESET = "Reset",
}

const newItem = ref("");
const selectedEditItemIndex = ref<number | undefined>();
const selectedEditItemText = ref("");
const selectedEditItemsRef = ref();

const handleNewItemInput = (event: Event) => {
  newItem.value = (event.target as HTMLInputElement).value;
};
const handleSelectedItemInput = (event: Event) => {
  selectedEditItemText.value = (event.target as HTMLInputElement).value;
};
const handleAddNewItem = () => {
  itemsStore.addItem(newItem.value);
  newItem.value = "";
};
const handleToggleItem = (index: number) => {
  itemsStore.toggleItem(index);
};
const handleRemoveItem = (index: number) => {
  itemsStore.removeItem(index);
};
const handleSaveItem = (index: number) => {
  itemsStore.editItem(index, selectedEditItemText.value);
  selectedEditItemIndex.value = undefined;
  selectedEditItemText.value = "";
};
const handleEditItem = (index: number) => {
  selectedEditItemIndex.value = index;
  selectedEditItemText.value = itemsStore.$state.items[index].text;
};

watch([selectedEditItemIndex, selectedEditItemsRef], (indexes) => {
  console.log({ indexes });
  if (selectedEditItemIndex !== undefined) {
    console.log(selectedEditItemsRef.value);
  }
});
</script>

<template>
  <h1>{{ HEADING }}</h1>
  <label>
    {{ ADD_ITEM_LABEL }}
    <input
      type="text"
      :value="newItem"
      @input="handleNewItemInput"
      @keyup.enter="handleAddNewItem"
    />
  </label>
  <button @click="handleAddNewItem">{{ ITEM_ACTION_BUTTON_LABEL.ADD }}</button>
  <ul>
    <li v-for="(item, index) in itemsStore.items" :key="index">
      <Transition mode="out-in">
        <div v-if="selectedEditItemIndex === index">
          <div>
            <input
              type="text"
              ref="selectedEditItemsRef"
              :value="itemsStore.$state.items[index].text"
              @input="handleSelectedItemInput"
              @keyup.enter="() => handleSaveItem(index)"
              @keyup.esc="selectedEditItemIndex = undefined"
            />
          </div>
          <button @click="() => handleSaveItem(index)">Save</button>
          <button @click="selectedEditItemIndex = undefined">Cancel</button>
        </div>
        <div v-else>
          <div :class="{ completed: item.completed }">{{ item.text }}</div>
          <button @click="() => handleToggleItem(index)">
            {{
              item.completed
                ? ITEM_ACTION_BUTTON_LABEL.RESET
                : ITEM_ACTION_BUTTON_LABEL.COMPLETE
            }}
          </button>
          <button @click="() => handleEditItem(index)">
            {{ ITEM_ACTION_BUTTON_LABEL.EDIT }}
          </button>
          <button @click="() => handleRemoveItem(index)">
            {{ ITEM_ACTION_BUTTON_LABEL.REMOVE }}
          </button>
        </div>
      </Transition>
    </li>
  </ul>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
