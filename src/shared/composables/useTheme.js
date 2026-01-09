import { ref, watch, onMounted } from "vue";

const THEME_KEY = "app-theme";
const themes = {
  light: "light",
  dark: "dark",
};

export function useTheme() {
  const currentTheme = ref(themes.dark);

  const setTheme = (theme) => {
    if (!themes[theme]) return;

    currentTheme.value = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  const toggleTheme = () => {
    const newTheme =
      currentTheme.value === themes.light ? themes.dark : themes.light;
    setTheme(newTheme);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const theme = savedTheme || themes.dark;
    setTheme(theme);
  };

  onMounted(() => {
    initTheme();
  });

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
  };
}
