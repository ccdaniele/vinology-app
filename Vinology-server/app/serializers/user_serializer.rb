# frozen_string_literal: true

class UserSerializer
  def initialize(user)
    @user = user
  end

  def as_json(*)
    {
      id: @user.id,
      name: @user.name,
      username: @user.username,
      email: @user.email
    }
  end
end
