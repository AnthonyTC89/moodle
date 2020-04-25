Rails.application.routes.draw do
  namespace :api do
    resources :academic_periods
    resources :users
    post "/users/login", to: "users#login"
  end
end
