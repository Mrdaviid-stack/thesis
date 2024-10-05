import React from "react";
import { useField } from "formik";
import { Editor } from "@tinymce/tinymce-react"
import { requestService } from "~/services/api.service";

interface InputProps {
    label: string;
    type?: string;
    [x: string]: any;
}

export const RichEditor: React.FC<InputProps> = ({ label, type, ...props }) => {
    const [field, meta, helpers] = useField(props as any)

    return (
        <div className="mb-3">
            <label htmlFor={props.id || props.name}>{ label }</label>
            <Editor
                apiKey="5imn2wxj7u7k9pblilyfjnpmswx1qkqh9r7x9d7olsxz3axf"
                value={field.value}
                init={{
                    height: 500,
                    menubar: "file edit view insert format tools table help",
                    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | bootstrapLayout',
                    toolbar_sticky: true,
                    relative_urls: false,
                    remove_script_host: true,
                    convert_urls: true,
                    automatic_uploads: true,
                    images_upload_handler: async (blobInfo) => new Promise((resolve, reject) => {
                        const formData = new FormData()
                        formData.append('image', blobInfo.blob(), blobInfo.filename())
                        requestService({ url: '/dashboard/files/upload', method: 'post', payload: formData, hasAttachment: true })
                            .then(response => {
                                resolve(response.data.location)
                            })
                            .catch(err => reject(err))
                    }),
                    setup: function (editor) {
                        var toggle = false;
                        editor.ui.registry.addMenuButton(
                            "bootstrapLayout",
                            {
                                text: "Layout",
                                fetch: function (cb) {
                                    var items: any[] = [
                                        {
                                            type: "menuitem",
                                            text: "(col-6 ~ 2)",
                                            onAction: function () {
                                                toggle = !toggle;
                                                editor.insertContent(
                                                    `<p><div class="row"><div class="col border_dashed"><p>col-6</p></div><div class="col border_dashed"><p>col-6</p></div></div></p>`,
                                                );
                                            },
                                        },
                                        {
                                            type: "menuitem",
                                            text: "(col-4 ~ 3)",
                                            onAction: function () {
                                                toggle = !toggle;
                                                editor.insertContent(
                                                    '<p><div class="row"><div class="col border_dashed">col-4</div><div class="col border_dashed">col-4</div><div class="col border_dashed">col-4</div></div></p>',
                                                );
                                            },
                                        },
                                        {
                                            type: "menuitem",
                                            text: "(col-3 ~ 4)",
                                            onAction: function () {
                                                toggle = !toggle;
                                                editor.insertContent(
                                                    '<p><div class="row"><div class="col border_dashed">col-3</div><div class="col border_dashed">col-3</div><div class="col border_dashed">col-3</div><div class="col border_dashed">col-3</div></div></p>',
                                                );
                                            },
                                        },
                                        {
                                            type: "menuitem",
                                            text: "(col-2 ~ 6)",
                                            onAction: function () {
                                                toggle = !toggle;
                                                editor.insertContent(
                                                    '<p><div class="row"><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div><div class="col border_dashed">col-2</div></div></p>',
                                                );
                                            },
                                        },
                                        {
                                            type: "menuitem",
                                            text: "(col-1 ~ 12)",
                                            onAction: function () {
                                                toggle = !toggle;
                                                editor.insertContent(
                                                    '<p><div class="row"><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div><div class="col border_dashed">col-1</div></div></p>',
                                                );
                                            },
                                        },
                                    ];
                                    cb(items);
                                },
                            },
                        );
                    },
                    content_css: [
                        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
                    ],
                    content_style:
                        "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; padding: 10px; } .border_dashed { border: 1px solid black!important; border-style: dashed!important; } ",
                }}
                onEditorChange={(content) => helpers.setValue(content)}
                {...props}
            />
            {meta.touched && meta.error ? (
                <div className="text-danger">{ meta.error }</div>
            ) : null}
        </div>
    )
}