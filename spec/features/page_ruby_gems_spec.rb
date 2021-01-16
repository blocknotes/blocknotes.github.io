# frozen_string_literal: true

describe 'visiting the ruby gems page', type: :feature, skip: true do
  it 'loads the page' do
    visit '/ruby/gems'
    expect(page).to have_css 'h1', text: 'Ruby gems'
  end
end
