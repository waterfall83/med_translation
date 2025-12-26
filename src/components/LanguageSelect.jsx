import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

export default function LanguageSelect({ language, setLanguage }) {
  return (
    <Select.Root value={language} onValueChange={setLanguage}>
      <Select.Trigger className="bg-gray-700 text-white px-3 py-2 rounded-lg flex justify-between items-center w-40">
        <Select.Value />
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content className="bg-gray-700 rounded-lg text-white">
        <Select.ScrollUpButton />
        <Select.Viewport>
          {["Spanish", "French", "Hindi", "Chinese", "Arabic", "German", "Portuguese", "Japanese", "Italian"].map((lang) => (
            <Select.Item
              key={lang}
              value={lang}
              className="px-3 py-2 hover:bg-gray-600 rounded-lg flex justify-between items-center"
            >
              <Select.ItemText>{lang}</Select.ItemText>
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
