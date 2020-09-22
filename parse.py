import quickjs
import json
from prosemirror.model import Node, Schema
from prosemirror.transform import Transform
from prosemirror.schema.basic import schema
from prosemirror.transform.step import Step

# c = quickjs.Context()
# schema = Path('schema_file_path').read_text()
# c.eval(schema)
# schema_json = c.eval('JSON.stringify(this.schema.nodes)')
# print(spec)
# schema_json = json.dumps(spec)
# spec = dict(nodes=json.loads(schema_json), marks={})
# sch = Schema(spec)


fo = open('docs/data/1.txt', 'r')
content = fo.read()
doc_json = json.loads(content)

doc_node = Node.from_json(schema, doc_json)
# tr = Transform(doc_node)


print(doc_node)

fo = open('docs/data/1.history.txt', 'r')
contents = fo.readlines()
for content in contents :
    step_json = json.loads(content)
    try :
        for step_delta in step_json['steps'] :
            step_node = Step.from_json(schema, step_delta)
            step_result = step_node.apply(doc_node)
            if step_result.ok :
                doc_node = step_result.doc
                # print(doc_node)
                print(doc_node.to_json())
            else :
                dummy = 'a'
    except :
        print('error: ' + str(step_json['version']))

print(doc_node)

exit()
