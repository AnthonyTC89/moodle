FactoryBot.define do
  factory :schedule do
    date { "2020-04-29" }
    time { "2020-04-29 17:30:34" }
    location { "MyString" }
    status { false }
    subject { nil }
  end
end
