'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import settingApi from '@/services/api/modules/setting-api'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface SettingProps {
  id?: string
  fee: number
}

const SettingsPage = () => {
  const [saving, setSaving] = useState<boolean>(false)
  const [settings, setSettings] = useState<SettingProps>({ id: '', fee: 0 })

  useEffect(() => {
    fetchSettings()
  }, [  ])

  const fetchSettings = async () => {
    try {
      const data = await settingApi.getSettings()
      if (data) {
        setSettings({
          id: data.settings?.id,
          fee: data.settings?.serviceFeeRate
            ? data.settings.serviceFeeRate * 100
            : 0,
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const onSaveSettings = async () => {
    try {
      setSaving(true)
      if (!settings.id) {
        const updatedSettings = await settingApi.createSettings(settings)
        if (updatedSettings.setting) {
          toast.success('설정을 성공적으로 만들었습니다!')
        }
        setSaving(false)
        return
      }
      const createdSettings = await settingApi.updateSettings(settings)
      if (createdSettings.setting) {
        toast.success('설정 업데이트가 성공적으로 완료되었습니다!')
      }
      setSaving(false)
      return
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading title={`설정`} description="게임 설정" />
        </div>
        <Separator />

        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-tight">
            IP 관리 (제공 예정)
          </h2>
        </div>

        <div className="mt-24">
          <h2 className="text-xl font-bold tracking-tight">서비스 수수료</h2>

          <div className="grid grid-cols-1 grid-cols-3 gap-2">
            <div className="mt-3 flex flex-col gap-2 ">
              <Label>요금 (0-100%) </Label>
              <Input
                placeholder="요금"
                type="number"
                min={0}
                max={100}
                value={settings.fee}
                onChange={e =>
                  setSettings({ ...settings, fee: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex items-end">
              <Button
                disabled={saving}
                type="submit"
                onClick={() => onSaveSettings()}
              >
                구하다
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
