#!/usr/bin/python
# -*- coding: UTF-8 -*-

from selenium import webdriver
import time

def take_screenshot(url, save_fn="capture.png"):
    browser = webdriver.Chrome()
    browser.set_window_size(1200, 900)
    browser.get(url) # Load page
    browser.execute_script("""
        (function () {
            var y = 0;
            var step = 100;
            window.scroll(0, 0);

            function f() {
                if (y < document.body.scrollHeight) {
                    y += step;
                    window.scroll(0, y);
                    setTimeout(f, 100);
                } else {
                    window.scroll(0, 0);
                    document.title += "scroll-done";
                }
            }

            setTimeout(f, 1000);
        })();
    """)

    for i in xrange(30):
        if "scroll-done" in browser.title:
            break
        time.sleep(10)

    browser.save_screenshot(save_fn)
    browser.close()


if __name__ == "__main__":

    take_screenshot("http://codingpy.com")