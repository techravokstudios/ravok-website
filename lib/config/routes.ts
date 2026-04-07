/**
 * Centralized route constants
 * Use these instead of hardcoding paths in components.
 */

export const routes = {
  // Public
  home: '/',
  aboutUs: '/about-us',
  ourModel: '/our-model',
  contactUs: '/contact-us',
  privacyPolicy: '/privacy-policy',
  termsAndConditions: '/terms-and-conditions',

  // Insights / Blog
  insights: '/insights',
  insightBySlug: (slug: string) => `/insights/${slug}` as const,
  insightsByCategory: (slug: string) => `/insights/category/${slug}` as const,

  // Confessions
  confessionsSubmit: '/confessions/submit',

  // Forms (creator submissions)
  form: '/form',
  formByType: (type: string) => `/form/${type}` as const,

  // Auth
  login: '/login',
  register: '/register',
  pending: '/pending',

  // Investor portal
  investor: {
    dashboard: '/investor',
    documents: '/investor/documents',
    post: '/investor/post',
    profile: '/investor/profile',
  },

  // Admin dashboard
  admin: {
    dashboard: '/admin',
    profile: '/admin/profile',
    posts: '/admin/posts',
    postAdd: '/admin/posts/add',
    postEdit: '/admin/posts/edit',
    categories: '/admin/categories',
    categoryAdd: '/admin/categories/add',
    categoryEdit: '/admin/categories/edit',
    forms: '/admin/forms',
    formView: '/admin/forms/view',
    investors: '/admin/investors',
    investorDetails: '/admin/investors/details',
    investorRequests: '/admin/investors/requests',
    investorApprove: '/admin/investors/approve',
    documents: {
      categories: '/admin/documents/categories',
      uploads: '/admin/documents/uploads',
    },
    settings: {
      email: '/admin/settings/email',
    },
  },
} as const;
