import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

const CustomDialog = ({
  visible, 
  hideDialog, 
  title, 
  message, 
  onConfirm,
  type = 'info'  // default to 'info'
}) => {
  return (
    <Portal>
      <Dialog 
        visible={visible} 
        onDismiss={hideDialog} 
        dismissable={false}
        style={{backgroundColor: 'white'}}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {type === 'confirm' ? (
            <>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={onConfirm}>Confirm</Button>
            </>
          ) : (
            <Button onPress={onConfirm}>Done</Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
export default CustomDialog;
