import React, { useState } from "react";
import { Button } from "antd";
import RenderFields from "./RenderFields";

function SchemaBuilder() {
  const [field, setField] = useState([
    {
      id: Date.now(),
      key: "",
      type: undefined,
      children: [],
    },
  ]);
//convert field structure to JSON schema
  const generateJson = (fields) => {
    const result = {};
    fields.forEach((f) => {
      const key = f.key ?? "";
      const type = f.type ?? "";
      if (type === "nested") {
        result[key] = generateJson(f.children); // nested structure
      } else {
        result[key] = type;
      }
    });
    return result;
  };

  //Update Key
  const handleChange = (e, id) => {
    const { value } = e.target;

    const updateFieldKey = (list) =>
      list.map((f) => {
        if (f.id === id) {
          return { ...f, key: value };
        } else if (f.children?.length) {
          return { ...f, children: updateFieldKey(f.children) };
        }
        return f;
      });

    const updatedFields = updateFieldKey(field);
    setField(updatedFields);
    console.log(updatedFields);
  };
//Update type
  const handleTypeChange = (value, id) => {
    const updateFieldType = (list) =>
      list.map((f) => {
        if (f.id === id) {
          if (value === "nested") {
            return { ...f, type: "nested", children: [] }; //Add children
          } else {
            const { children, ...rest } = f; //remove children for non-nested 
            return { ...rest, type: value };
          }
        } else if (f.children?.length) {
          return { ...f, children: updateFieldType(f.children) };
        }
        return f;
      });

    const updatedFields = updateFieldType(field);
    setField(updatedFields);
    console.log(updatedFields);
  };
//Top level fields
  const handleAddfield = () => {
    const newfield = {
      id: Date.now(),
      key: "",
      type: undefined,
    };
    setField([...field, newfield]);
  };
//Deleted Field
  const handleDeleteField = (id) => {
    const deleteField = (list) =>
      list
        .map((f) => {
          if (f.children?.length) {
            return { ...f, children: deleteField(f.children) };
          }
          return f;
        })
        .filter((f) => f.id !== id);

    const updatedFields = deleteField(field);
    setField(updatedFields);
  };
//Add nested field inside any field
  const handleAddNesting = (parentId) => {
    const addNested = (list) =>
      list.map((f) => {
        if (f.id === parentId) {
          const newChild = {
            id: Date.now(),
            key: "",
            type: undefined,
            children: [],
          };
          return {
            ...f,
            type: "nested",
            children: [...(f.children || []), newChild],
          };
        } else if (f.children?.length) {
          return { ...f, children: addNested(f.children) };
        }
        return f;
      });
    const updatedFields = addNested(field);
    setField(updatedFields);
  };

  return (
    <div className="flex gap-6 ">
      <div className="w-1/2 space-y-4">
      {field.map((f) => (
        <RenderFields
          key={f.id}
          field={f}
          onChange={handleChange}
          onTypeChange={handleTypeChange}
          onAddNested={handleAddNesting}
          onDelete={handleDeleteField}
        />
      ))}
      <Button className="p-6 m-4" type="primary" onClick={handleAddfield}>+ Add Field</Button>
      </div>
      <div className="w-1/2 bg-gray-200 rounded-xl p-4 m-5 shadow  h-fit">
      <h3 className="text-lg font-semibold mb-2">Live JSON </h3>
        <pre className=" p-4 rounded  text-sm">{JSON.stringify(generateJson(field), null, 2)}</pre>
      </div>
    </div>
  );
}

export default SchemaBuilder;
