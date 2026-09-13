export const languages = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  pt: 'Português',
} as const;

export type SupportedLanguage = keyof typeof languages;
export const defaultLang: SupportedLanguage = 'en';

export function getRelativeLocaleUrl(lang: string, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  if (lang === defaultLang) {
    return cleanPath ? `/${cleanPath}/` : '/';
  }
  return cleanPath ? `/${lang}/${cleanPath}/` : `/${lang}/`;
}

export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.generator': 'Favicon Generator',
    'nav.sizes': 'Size Guide',
    'nav.mockups': 'Device Mockups',
    'nav.snippets': 'Code Snippets',
    'nav.faq': 'FAQ',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Service',
    'nav.about': 'About Us',
    'nav.contact': 'Contact Us',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.generator': 'Generador de Favicon',
    'nav.sizes': 'Guía de Tamaños',
    'nav.mockups': 'Maquetas de Dispositivos',
    'nav.snippets': 'Fragmentos de Código',
    'nav.faq': 'Preguntas Frecuentes',
    'nav.privacy': 'Política de Privacidad',
    'nav.terms': 'Términos de Servicio',
    'nav.about': 'Sobre Nosotros',
    'nav.contact': 'Contacto',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.generator': 'Favicon Generator',
    'nav.sizes': 'Größenratgeber',
    'nav.mockups': 'Geräte-Mockups',
    'nav.snippets': 'Code-Snippets',
    'nav.faq': 'Häufige Fragen',
    'nav.privacy': 'Datenschutz',
    'nav.terms': 'Nutzungsbedingungen',
    'nav.about': 'Über Uns',
    'nav.contact': 'Kontakt',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.generator': 'Générateur de Favicon',
    'nav.sizes': 'Guide des Tailles',
    'nav.mockups': 'Aperçus Appareils',
    'nav.snippets': 'Extraits de Code',
    'nav.faq': 'FAQ',
    'nav.privacy': 'Politique de Confidentialité',
    'nav.terms': 'Conditions d\'Utilisation',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.generator': 'ファビコンジェネレーター',
    'nav.sizes': 'サイズガイド',
    'nav.mockups': '端末モックアップ',
    'nav.snippets': 'コードスニペット',
    'nav.faq': 'よくある質問',
    'nav.privacy': 'プライバシーポリシー',
    'nav.terms': '利用規約',
    'nav.about': '運営会社・概要',
    'nav.contact': 'お問い合わせ',
  },
  pt: {
    'nav.home': 'Início',
    'nav.generator': 'Gerador de Favicon',
    'nav.sizes': 'Guia de Tamanhos',
    'nav.mockups': 'Modelos de Dispositivos',
    'nav.snippets': 'Trechos de Código',
    'nav.faq': 'Perguntas Frequentes',
    'nav.privacy': 'Política de Privacidade',
    'nav.terms': 'Termos de Serviço',
    'nav.about': 'Sobre Nós',
    'nav.contact': 'Contato',
  },
} as const;
