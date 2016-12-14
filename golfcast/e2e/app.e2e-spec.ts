import { GolfcastPage } from './app.po';

describe('golfcast App', function() {
  let page: GolfcastPage;

  beforeEach(() => {
    page = new GolfcastPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
