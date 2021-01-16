# frozen_string_literal: true

describe 'visiting a missing page', type: :feature, skip: true do
  it 'loads the 404 page' do
    visit '/some-missing-page'
    expect(page).to have_title '404 - Page not found'
  end
end
