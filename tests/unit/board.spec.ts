import { shallowMount } from "@vue/test-utils";
import Header from "@/components/Header.vue";

describe("Header.vue", () => {
  it("renders props.title and props.count when passed", () => {
    const title = "title";
    const count = 50;
    const wrapper = shallowMount(Header, {
      propsData: { title, count },
    });
    expect(wrapper.text()).toMatch(title);
    expect(wrapper.text()).toMatch(count.toString());
  });
});
