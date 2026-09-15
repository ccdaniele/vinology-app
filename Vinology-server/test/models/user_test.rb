require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test 'requires unique username' do
    User.create!(username: 'demo', email: 'a@example.com', password: 'password')
    duplicate = User.new(username: 'demo', email: 'b@example.com', password: 'password')

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:username], 'has already been taken'
  end

  test 'requires password of minimum length' do
    user = User.new(username: 'short', email: 's@example.com', password: '123')
    assert_not user.valid?
    assert_includes user.errors[:password], 'is too short (minimum is 6 characters)'
  end
end
