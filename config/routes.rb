Rails.application.routes.draw do
  
  namespace :api do
    resources :subjects
    get "/subjects_full/", to: "subjects#full_index"

    resources :courses
    get "/courses_full/", to: "courses#full_index"

    resources :academic_periods
    get "/academic_periods_active", to: "academic_periods#index_active"
    
    resources :users
    post "/users/login", to: "users#login"
  end
end
