import { defineStore } from "pinia";
import { ref } from "vue";

interface IItem {
  text: string;
  completed: boolean;
}

export const useItemsStore = defineStore("items", () => {
  const items = ref<IItem[]>([]);

  const addItem = (itemTitle: string) => {
    if (itemTitle.length) {
      items.value.push({ text: itemTitle, completed: false });
    }
  };

  const toggleItem = (index: number) => {
    if (items.value[index]) {
      items.value[index].completed = !items.value[index].completed;
    }
  };

  const removeItem = (index: number) => {
    if (items.value[index]) {
      items.value.splice(index, 1);
    }
  };

  const editItem = (index: number, text: string) => {
    if (items.value[index]) {
      items.value[index].text = text;
    }
  };

  return { items, addItem, toggleItem, removeItem, editItem };
});
