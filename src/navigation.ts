import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Главная',
      href: getPermalink('/'),
    },
    {
      text: 'Продукция',
      links: [
        {
          text: 'Все продукты',
          href: getPermalink('/products'),
        },
        {
          text: 'Элементы антенно-волноводного тракта',
          href: getPermalink('/products/category/antenna-elements'),
        },
        {
          text: 'Усилители мощности',
          href: getPermalink('/products/category/power-amplifiers'),
        },
        {
          text: 'Системы резервирования 1:1',
          href: getPermalink('/products/category/redundancy-systems'),
        },
        {
          text: 'Преобразователи частоты',
          href: getPermalink('/products/category/frequency-converters'),
        },
        {
          text: 'Коммутаторы сигналов',
          href: getPermalink('/products/category/signal-switches'),
        },
        {
          text: 'Генераторы сигналов',
          href: getPermalink('/products/category/signal-generators'),
        },
      ],
    },
    {
      text: 'Публикации',
      href: getBlogPermalink(),
    },
    {
      text: 'О компании',
      href: getPermalink('/about'),
    },
    {
      text: 'Контакты',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Связаться с нами', href: getPermalink('/contact') }],
};

export const footerData = {
  links: [
    {
      title: 'Продукция',
      links: [
        { text: 'Все продукты', href: getPermalink('/products') },
        { text: 'Усилители мощности', href: getPermalink('/products/category/power-amplifiers') },
        { text: 'Преобразователи частоты', href: getPermalink('/products/category/frequency-converters') },
        { text: 'Коммутаторы сигналов', href: getPermalink('/products/category/signal-switches') },
        { text: 'Системы резервирования', href: getPermalink('/products/category/redundancy-systems') },
        { text: 'Генераторы сигналов', href: getPermalink('/products/category/signal-generators') },
      ],
    },
    {
      title: 'Компания',
      links: [
        { text: 'О нас', href: getPermalink('/about') },
        { text: 'Публикации', href: getBlogPermalink() },
        { text: 'Контакты', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Информация',
      links: [
        { text: 'Политика конфиденциальности', href: getPermalink('/privacy') },
        { text: 'Условия использования', href: getPermalink('/terms') },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Условия использования', href: getPermalink('/terms') },
    { text: 'Политика конфиденциальности', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Email', icon: 'tabler:mail', href: 'mailto:info@mw-lab.ru' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    © ${new Date().getFullYear()} Лаборатория Микроволн. Все права защищены.
  `,
};
