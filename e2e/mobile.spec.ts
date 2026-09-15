import {
  expect,
  test,
} from "@playwright/test";

test.use({
  viewport: {
    width: 390,
    height: 844,
  },
});

test(
  "dashboard remains usable on mobile",
  async ({
    page,
  }) => {
    await page.goto(
      "/requests",
    );

    await expect(
      page.getByRole(
        "heading",
        {
          name: "Requests",
          level: 2,
        },
      ),
    ).toBeVisible();

    await page
      .getByRole(
        "button",
        {
          name:
            "Open navigation",
        },
      )
      .click();

    await expect(
      page.getByRole(
        "link",
        {
          name:
            /services/i,
        },
      ),
    ).toBeVisible();

    await page
      .getByRole(
        "link",
        {
          name:
            /services/i,
        },
      )
      .click();

    await expect(
      page,
    ).toHaveURL(
      /\/services/,
    );

    const hasDocumentOverflow =
      await page.evaluate(
        () =>
          document
            .documentElement
            .scrollWidth >
          document
            .documentElement
            .clientWidth,
      );

    expect(
      hasDocumentOverflow,
    ).toBe(false);
  },
);