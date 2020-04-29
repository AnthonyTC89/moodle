Rails.application.routes.draw do
  namespace :api do
    resources :schedules, only: [:create, :update, :destroy]
    get "/schedules_full/", to: "schedules#index_full"

    resources :documents, only: [:create, :destroy]
    get "/documents_full/", to: "documents#index_full"

    resources :subjects, only: [:create, :update, :destroy]
    get "/subjects_full/", to: "subjects#full_index"

    resources :courses, only: [:create, :update, :destroy]
    get "/courses_full/", to: "courses#full_index"

    resources :academic_periods, only: [:index, :create, :update, :destroy]
    get "/academic_periods_active", to: "academic_periods#index_active"
    
    resources :users
    post "/users/login", to: "users#login"
  end
end
