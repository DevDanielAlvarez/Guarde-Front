import { useState } from 'react';
import { View } from 'react-native';

import { OptionPickerModal, type PickerOption } from '@/components/option-picker-modal';
import { SelectableChip } from '@/components/selectable-chip';

type OptionChipGroupProps = {
  options: PickerOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  pickerTitle: string;
  commonCount?: number;
  moreLabel?: string;
};

export function OptionChipGroup({
  options,
  selectedIds,
  onToggle,
  pickerTitle,
  commonCount = 8,
  moreLabel = 'Outras opções',
}: OptionChipGroupProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const commonOptions = options.slice(0, commonCount);
  const commonIds = new Set(commonOptions.map((option) => option.id));
  // Selections made through the "more options" picker still need a visible,
  // tappable chip here so the user can see and undo them without reopening it.
  const extraSelected = options.filter(
    (option) => selectedIds.includes(option.id) && !commonIds.has(option.id)
  );

  return (
    <View className="flex-row flex-wrap gap-2">
      {commonOptions.map((option) => (
        <SelectableChip
          key={option.id}
          label={option.label}
          selected={selectedIds.includes(option.id)}
          onPress={() => onToggle(option.id)}
        />
      ))}
      {extraSelected.map((option) => (
        <SelectableChip
          key={option.id}
          label={option.label}
          selected
          onPress={() => onToggle(option.id)}
        />
      ))}
      {options.length > commonCount ? (
        <SelectableChip label={`+ ${moreLabel}`} onPress={() => setPickerOpen(true)} />
      ) : null}

      <OptionPickerModal
        visible={pickerOpen}
        title={pickerTitle}
        options={options}
        selectedIds={selectedIds}
        onToggle={onToggle}
        onClose={() => setPickerOpen(false)}
      />
    </View>
  );
}
