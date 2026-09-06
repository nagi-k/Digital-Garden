import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=2)
        await page.goto("http://localhost:3000/", wait_until="networkidle")
        await page.wait_for_timeout(1500)

        section = page.locator("section", has=page.locator('button[aria-label="缩小"]')).first
        await section.scroll_into_view_if_needed()
        await page.wait_for_timeout(2500)  # 等 FadeIn 动画完成

        await section.screenshot(path="/tmp/map1.png")
        print("map1 saved")

        zoom_out = page.locator('button[aria-label="缩小"]')
        for i in range(3):
            await zoom_out.click()
            await page.wait_for_timeout(500)
        await page.wait_for_timeout(500)  # 等 transform 过渡结束
        await section.screenshot(path="/tmp/map2.png")
        print("map2 saved")

        zoom_in = page.locator('button[aria-label="放大"]')
        for i in range(3):
            await zoom_in.click()
            await page.wait_for_timeout(500)
        await page.wait_for_timeout(500)
        await section.screenshot(path="/tmp/map3.png")
        print("map3 saved")

        svg_style = await page.locator("section svg").first.get_attribute("style")
        print("final svg style:", svg_style)

        await browser.close()

asyncio.run(main())
