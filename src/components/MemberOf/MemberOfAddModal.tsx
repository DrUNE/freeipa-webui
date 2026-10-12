import React from "react";
// PatternFly
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@patternfly/react-core";
// Components
import DualListSelectorGeneric, {
  DualListOption,
  optionsToDualListOptions,
} from "../layouts/DualListSelectorGeneric";

export interface AvailableItems {
  key: string;
  title: string;
}

type SearchProps = {
  onSearchTextChange: (searchText: string) => void;
};

interface PropsToAdd {
  showModal: boolean;
  onCloseModal: () => void;
  availableItems: AvailableItems[];
  onAdd: (items: AvailableItems[]) => void;
  title: string;
  ariaLabel: string;
  spinning: boolean;
  searchProps?: SearchProps;
}

const InnerMemberOfAddModal = (props: PropsToAdd) => {
  // Dual list data
  const availableItemsIDs = React.useMemo(
    () => props.availableItems.map((d) => d.key),
    [props.availableItems]
  );

  // States
  const [previousAvailableItemsIDs, setPreviousAvailableItemsIDs] =
    React.useState<string[]>([]);

  // Options
  const [availableOptions, setAvailableOptions] = React.useState<
    DualListOption[]
  >(() => optionsToDualListOptions(availableItemsIDs));
  const [chosenOptions, setChosenOptions] = React.useState<DualListOption[]>(
    []
  );

  if (
    JSON.stringify(previousAvailableItemsIDs) !==
    JSON.stringify(availableItemsIDs)
  ) {
    setPreviousAvailableItemsIDs(availableItemsIDs);
    setAvailableOptions(
      optionsToDualListOptions(
        availableItemsIDs.filter(
          (id) => !chosenOptions.map((o) => o.text).includes(id)
        )
      )
    );
  }

  const fields = [
    {
      id: "dual-list-selector",
      name: "Available options",
      pfComponent: (
        <DualListSelectorGeneric
          id="add-modal-dual-list-selector"
          availableOptions={availableOptions}
          setAvailableOptions={setAvailableOptions}
          chosenOptions={chosenOptions}
          setChosenOptions={setChosenOptions}
          searchProps={props.searchProps}
        />
      ),
    },
  ];

  // Buttons are disabled until the user fills the required fields
  const buttonDisabled = chosenOptions.length === 0;

  // Add group option
  const onClickAddHandler = () => {
    const optionsToAdd = chosenOptions.map((opt) => ({
      key: opt.text,
      title: opt.text,
    }));
    props.onAdd(optionsToAdd);
    setChosenOptions([]);
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClickAddHandler();
  };

  // Buttons that will be shown at the end of the form
  const modalActions = [
    <Button
      data-cy="modal-button-add"
      key="add-new-user"
      variant="secondary"
      isDisabled={buttonDisabled || props.spinning}
      type="submit"
      form="is-member-of-add-modal"
      spinnerAriaValueText="Adding"
      spinnerAriaLabel="Adding"
      isLoading={props.spinning}
    >
      {props.spinning ? "Adding" : "Add"}
    </Button>,
    <Button
      data-cy="modal-button-cancel"
      key="cancel-new-user"
      variant="link"
      onClick={props.onCloseModal}
    >
      Cancel
    </Button>,
  ];

  return (
    <Modal
      data-cy="member-of-add-modal"
      variant={"medium"}
      position={"top"}
      positionOffset={"76px"}
      isOpen={props.showModal}
      onClose={props.onCloseModal}
      aria-label={props.ariaLabel}
    >
      <ModalHeader title={props.title} labelId="member-of-add-modal-title" />
      <ModalBody id="member-of-add-modal-body">
        <Form id={"is-member-of-add-modal"} onSubmit={onFormSubmit}>
          {fields.map((field) => (
            <FormGroup key={field.id} fieldId={field.id}>
              {field.pfComponent}
            </FormGroup>
          ))}
        </Form>
      </ModalBody>
      <ModalFooter>{modalActions}</ModalFooter>
    </Modal>
  );
};

const MemberOfAddModal = (props: PropsToAdd) => {
  if (!props.showModal) {
    return null;
  }

  return <InnerMemberOfAddModal {...props} />;
};

export default MemberOfAddModal;
