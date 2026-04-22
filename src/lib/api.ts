/**
 * @deprecated Import directly from @/lib/api/v1/* or @/lib/api/base instead.
 * This file re-exports everything for backward compatibility during migration.
 */

// Base utilities
export { getApiBase, getToken, setAuth, getStoredUser, clearAuth, getAuthHeaders, fetchApi, handleResponse } from './api/base';
export type { User } from './api/base';

// Auth
export { login, register, logout, me } from './api/v1/auth';
export type { LoginResponse, RegisterResponse } from './api/v1/auth';

// Dashboard
export { getDashboard } from './api/v1/dashboard';
export type { DashboardCounts } from './api/v1/dashboard';

// Users
export { getUsers, getUser, approveUser, rejectUser } from './api/v1/users';
export type { UserListResponse } from './api/v1/users';

// Profile
export { getAvatarUrl, getProfile, updateProfile, updateProfileWithAvatar, changePassword } from './api/v1/profile';

// Documents
export { storageUrl, getDocumentCategories, createDocumentCategory, updateDocumentCategory, deleteDocumentCategory, listInvestorDocuments, getInvestorDocument, investorDocumentFileUrl, getDocumentFileUrl, uploadInvestorDocuments, updateInvestorDocument, deleteInvestorDocument } from './api/v1/documents';
export type { DocumentCategory, InvestorDocument, InvestorDocumentsResponse } from './api/v1/documents';

// Posts & Categories
export { getPostImageUrl, getCategories, getCategory, createCategory, updateCategory, deleteCategory, getPosts, getPost, uploadPostImage, createPost, updatePost, deletePost, getPublicCategories, getPublicFeaturedPosts, getPublicPosts, getPublicPostBySlug, getPublicPostComments, createPublicPostComment } from './api/v1/posts';
export type { Category, CategoryListResponse, CategoryWithCount, Post, PostListResponse, PostComment } from './api/v1/posts';

// Document Views (tracking)
export { startViewSession, logPageEvents, endViewSession } from './api/v1/document-views';
export type { ViewSession, PageEvent } from './api/v1/document-views';

// Forms
export { submitPublicForm, listFormSubmissions, exportFormSubmissionsCsvUrl, getFormSubmission, deleteFormSubmission } from './api/v1/forms';
export type { FormType, FormSubmission, FormSubmissionList } from './api/v1/forms';

// Settings
export { getMailSettings, updateMailSettings, testMailSettings } from './api/v1/settings';
export type { MailSettings } from './api/v1/settings';
