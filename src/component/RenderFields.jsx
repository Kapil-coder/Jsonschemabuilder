import { Button, Input, Select } from 'antd'
import React from 'react'

function RenderFields({
    field,
    onChange,
    onTypeChange,
    onDelete,
    onAddNested
}) {


  return (
    <div className='bg-white  rounded-xl p-4  ' >
        <div className='flex  gap-3 items-center'>
         <Input 
            placeholder="field name"
            value={field.key}
            onChange={(e)=>onChange(e,field.id)}
            
          />
          <Select
        placeholder="field type"
        value={field.type}
        options={[
          { value: "string" },
          { value: "nested" },
          { value: "number" },
          { value: "boolean" },
          { value: "array" },
          { value: "object" },
          { value: "objectId" },
          { value: "arrayObject" },
        ]}
        onChange={(value) => onTypeChange(value, field.id)}
        
        
      />
      <Button danger onClick={() => onDelete(field.id)}>
        Delete
      </Button>
       {field.type === "nested" && (
        <Button type='primary'  onClick={() => onAddNested(field.id)} >
          + Add Nested Field
        </Button>
    
      )}
      </div>
      <div className="ml-6 mt-4 border-l-2 border-gray-300 pl-4 space-y-4">
        {/* If the field has children, render them recursively */}
      {field.children?.map((child) => (
        <RenderFields
          key={child.id}
          field={child}
          onChange={onChange}
          onTypeChange={onTypeChange}
          onDelete={onDelete}
          onAddNested={onAddNested}
          
        />
      ))}
      </div>
    </div>
  )
}

export default RenderFields