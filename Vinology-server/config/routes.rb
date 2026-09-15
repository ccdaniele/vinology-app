Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create]
      resources :queries, only: [:index, :create, :update, :destroy]
      resources :cars, only: [:index, :show, :create, :destroy]

      post '/login', to: 'auth#create'
      get '/profile', to: 'users#profile'
      get '/current_user', to: 'auth#show'
    end
  end
end
