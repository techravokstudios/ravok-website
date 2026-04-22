<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\PublicInsightsController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DocumentCategoryController;
use App\Http\Controllers\Api\DocumentViewController;
use App\Http\Controllers\Api\InvestorDocumentController;
use App\Http\Controllers\Api\FormSubmissionController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public insights (no auth) – for /insights page
Route::get('/public/categories', [PublicInsightsController::class, 'categories']);
Route::get('/public/posts/featured', [PublicInsightsController::class, 'featured']);
Route::get('/public/posts', [PublicInsightsController::class, 'posts']);
Route::get('/public/posts/slug/{slug}', [PublicInsightsController::class, 'showBySlug']);
Route::get('/public/posts/slug/{slug}/comments', [PublicInsightsController::class, 'comments']);
Route::post('/public/posts/slug/{slug}/comments', [PublicInsightsController::class, 'storeComment']);

// Public forms
Route::post('/public/forms/{type}', [FormSubmissionController::class, 'store']);

// Authenticated (admin or investor)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Profile (both)
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);

    // Dashboard (both; investor must be approved)
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('investor.approved');

    // Posts: admin gets full CRUD, investor gets published only (investor must be approved)
    Route::middleware('investor.approved')->group(function () {
        Route::get('/posts', [PostController::class, 'index']);
        Route::get('/posts/{post}', [PostController::class, 'show']);
        // Investor documents listing (view only)
        Route::get('/documents', [InvestorDocumentController::class, 'index']);
        Route::get('/documents/{document}', [InvestorDocumentController::class, 'show']);
        Route::get('/documents/{document}/file', [InvestorDocumentController::class, 'streamFile']);
        // Document categories (view only)
        Route::get('/document-categories', [DocumentCategoryController::class, 'index']);
        // Document view tracking
        Route::post('/documents/{document}/views', [DocumentViewController::class, 'startSession']);
        Route::post('/document-views/{sessionToken}/pages', [DocumentViewController::class, 'logPages']);
        Route::post('/document-views/{sessionToken}/end', [DocumentViewController::class, 'endSession']);
    });

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::post('/users/{user}/approve', [UserController::class, 'approve']);
        Route::post('/users/{user}/reject', [UserController::class, 'reject']);

        Route::apiResource('categories', CategoryController::class);

        Route::get('/settings/mail', [SettingsController::class, 'mail']);
        Route::put('/settings/mail', [SettingsController::class, 'updateMail']);

        Route::post('/upload/image', [UploadController::class, 'image']);
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{post}', [PostController::class, 'update']);
        Route::patch('/posts/{post}', [PostController::class, 'update']);
        Route::delete('/posts/{post}', [PostController::class, 'destroy']);

        // Investor documents (admin manage)
        // Exclude 'index' to avoid shadowing investor view-only route above
        Route::apiResource('document-categories', DocumentCategoryController::class)->except(['show', 'index']);
        Route::post('/documents', [InvestorDocumentController::class, 'store']); // multiple upload
        Route::put('/documents/{document}', [InvestorDocumentController::class, 'update']);
        Route::delete('/documents/{document}', [InvestorDocumentController::class, 'destroy']);

        // Form submissions
        Route::get('/forms', [FormSubmissionController::class, 'index']);
        Route::get('/forms/{submission}', [FormSubmissionController::class, 'show']);
        Route::get('/forms/export/csv', [FormSubmissionController::class, 'downloadCsv']);
        Route::delete('/forms/{submission}', [FormSubmissionController::class, 'destroy']);
        Route::post('/settings/email/test', [SettingsController::class, 'testMail']);
    });
});
