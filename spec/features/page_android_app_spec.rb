# frozen_string_literal: true

describe 'visiting the android app page', type: :feature do
  it 'loads the page' do
    visit "/android/app?#{QUERY_SKIP_PARAM}"
    expect(page).to have_css 'h1', text: 'Android App'
  end
end
