import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTracked} from '../../provider';
import {eSubscribeEvent, eUnSubscribeEvent} from '../../services/EventManager';
import {eCloseProgressDialog, eOpenProgressDialog} from '../../utils/Events';
import {SIZE} from '../../utils/SizeUtils';
import {sleep} from '../../utils/TimeUtils';
import ActionSheetWrapper from '../ActionSheetComponent/ActionSheetWrapper';
import {Button} from '../Button';
import {Toast} from '../Toast';
import Heading from '../Typography/Heading';
import Paragraph from '../Typography/Paragraph';

const ProgressDialog = () => {
  const [state] = useTracked();
  const {colors} = state;
  const [visible, setVisible] = useState(false);
  const [dialogData, setDialogData] = useState({
    title: 'Loading',
    paragraph: 'Loading tagline',
  });
  const actionSheetRef = useRef();
  useEffect(() => {
    eSubscribeEvent(eOpenProgressDialog, open);
    eSubscribeEvent(eCloseProgressDialog, close);
    return () => {
      eUnSubscribeEvent(eOpenProgressDialog, open);
      eUnSubscribeEvent(eCloseProgressDialog, close);
    };
  }, []);

  const open = async (data) => {
    setDialogData(data);
    setVisible(true);
    await sleep(1);
    actionSheetRef.current?.setModalVisible(true);
  };

  const close = () => {
    setVisible(false);
  };

  return !visible ? null : (
    <ActionSheetWrapper
      fwdRef={actionSheetRef}
      gestureEnabled={dialogData?.noProgress}
      onClose={() => {
        if (dialogData.noProgress) {
          setVisible(false);
          setDialogData(null);
        }
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
          paddingHorizontal: 12,
        }}>
        {!dialogData?.noProgress ? (
          <ActivityIndicator size={50} color={colors.accent} />
        ) : (
          <Icon
            color={colors.accent}
            name={dialogData.icon || 'check'}
            size={50}
          />
        )}

        <Heading> {dialogData?.title}</Heading>
        <Paragraph style={{textAlign: 'center'}}>
          {dialogData?.paragraph}
          {!dialogData?.noProgress ? (
            <Paragraph color={colors.errorText}>
              {' '}
              Do not close the app.
            </Paragraph>
          ) : null}
        </Paragraph>
      </View>
      <View
        style={{
          paddingHorizontal: 12,
          backgroundColor: colors.shade,
          marginBottom: 12,
        }}>
        {dialogData.valueArray &&
          dialogData.valueArray.map((v) => (
            <Button
              title={v}
              type="transparent"
              textStyle={{fontWeight: 'normal'}}
              fontSize={SIZE.sm}
              icon="check"
              width="100%"
              style={{
                justifyContent: 'flex-start',
                backgroundColor: 'transparent',
              }}
            />
          ))}
      </View>

      <View
        style={{
          paddingHorizontal: 12,
        }}>
        {dialogData?.action ? (
          <Button
            onPress={dialogData.action}
            title={dialogData.actionText}
            fontSize={SIZE.lg}
            type="accent"
            height={50}
            width="100%"
            fontSize={SIZE.md}
          />
        ) : null}
        
        {dialogData?.actionsArray &&
          dialogData?.actionsArray.map((item) => (
            <Button
              onPress={item.action}
              title={item.actionText}
              type="accent"
              height={50}
              style={{
                marginBottom: 10,
              }}
              width="100%"
              fontSize={SIZE.md}
            />
          ))}
      </View>
    </ActionSheetWrapper>
  );
};

export default ProgressDialog;
