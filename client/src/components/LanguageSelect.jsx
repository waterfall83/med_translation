import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

export default function LanguageSelect({ value, onChange }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="bg-gray-700 text-white px-3 py-2 rounded-lg flex justify-between items-center w-40">
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Content className="bg-gray-700 rounded-lg text-white">
        <Select.ScrollUpButton />
        <Select.Viewport>
          {[
            "spanish",
            "french",
            "hindi",
            "chinese",
            "arabic",
            "german",
            "portuguese",
            "japanese",
            "italian",
          ].map((lang) => (
            <Select.Item
              key={lang}
              value={lang}
              className="px-3 py-2 hover:bg-gray-600 rounded-lg flex justify-between items-center"
            >
              <Select.ItemText>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Select.ItemText>
              <Select.ItemIndicator>
                <CheckIcon />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
        <Select.ScrollDownButton />
      </Select.Content>
    </Select.Root>
  );
}
