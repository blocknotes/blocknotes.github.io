# frozen_string_literal: true

describe 'visiting the ruby gems page', type: :feature do
  it 'loads the page' do
    visit "/ruby/gems?#{QUERY_SKIP_PARAM}"
    expect(page).to have_css 'h1', text: 'Ruby gems'
  end
end
