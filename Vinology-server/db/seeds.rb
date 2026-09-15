# Seed a demo user that can actually log in (uses has_secure_password).

user = User.find_or_create_by!(username: 'demo') do |u|
  u.email = 'demo@example.com'
  u.name = 'Demo User'
  u.password = 'password'
end

query = user.queries.find_or_create_by!(name: 'Demo query')

query.cars.find_or_create_by!(vin_number: '1HGCM82633A004352') do |car|
  car.make = 'Honda'
  car.model = 'Accord'
  car.year = '2003'
end
