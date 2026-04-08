const themeMap = {
  low_chaos: {
    badge: "Reinicio Necessario",
    icon: "!",
    message: "Ha potencial, mas agora o foco precisa ser reconstrucao de base.",
    surface: "theme-chaos",
  },
  mid_hope: {
    badge: "Progresso Real",
    icon: "+",
    message: "Boa evolucao. O entendimento esta aparecendo com mais consistencia.",
    surface: "theme-hope",
  },
  high_victory: {
    badge: "Execucao Forte",
    icon: "*",
    message: "Voce dominou a maior parte da lista com seguranca e clareza.",
    surface: "theme-victory",
  },
  low_recover: {
    badge: "Hora de Retomar",
    icon: "~",
    message: "Ainda ha pontos centrais para revisar, mas o caminho de recuperacao e claro.",
    surface: "theme-recover",
  },
  mid_garden: {
    badge: "Base em Crescimento",
    icon: "#",
    message: "Seu desempenho mostra base construida, mas ainda com lacunas importantes.",
    surface: "theme-garden",
  },
  high_pink: {
    badge: "Destaque de Performance",
    icon: "<3",
    message: "Voce entregou uma leitura muito boa da lista e mostrou maturidade tecnica.",
    surface: "theme-pink",
  },
};

export function getThemeConfig(themeKey) {
  return themeMap[themeKey] || themeMap.mid_hope;
}

export default themeMap;
