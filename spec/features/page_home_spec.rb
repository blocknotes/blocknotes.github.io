# frozen_string_literal: true

describe 'visiting the homepage', type: :feature do
  it 'loads the page' do
    visit '/'
    expect(page).to have_css 'h1', text: 'blocknot.es'
    expect(page).to have_content "A Developer's Journey"
  end
end
