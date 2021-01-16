# frozen_string_literal: true

describe 'visiting the about me page', type: :feature do
  it 'loads the page' do
    visit '/about-me'
    expect(page).to have_css 'h1', text: 'About me'
  end
end
