Rails.application.routes.draw do
  namespace :api do
    resources :courses
    get "/courses/full", to: "courses#full_index"

    resources :academic_periods
    get "/academic_periods/active", to: "academic_periods#index_active"
    
    resources :users
    post "/users/login", to: "users#login"
  end
end
